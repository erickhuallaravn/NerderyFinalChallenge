import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToShopCartInput } from '../../dtos/requests/shop-cart/add-to-shop-cart.input';

@Injectable()
export class ShopCartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateHeader(customerId: string) {
    let header = await this.prisma.shopCartHeader.findFirst({
      where: { customerId },
    });

    if (!header) {
      header = await this.prisma.shopCartHeader.create({
        data: {
          customerId,
          name: 'default',
        },
      });
    }

    return header;
  }

  async getItems(customerId: string) {
    const header = await this.getOrCreateHeader(customerId);

    return this.prisma.shopCartItem.findMany({
      where: { shoppingCartHeaderId: header.id },
      include: {
        itemDiscounts: true,
      },
    });
  }

  async addOrUpdateItem(
    customerId: string,
    input: AddToShopCartInput,
  ): Promise<boolean> {
    const { productVariationId, quantity } = input;
    const productInfo = await this.prisma.productVariation.findUnique({
      where: { id: productVariationId },
      select: { name: true, price: true },
    });
    if (!productInfo)
      throw new NotFoundException('The product specified does not exist.');

    const header = await this.getOrCreateHeader(customerId);

    const existing = await this.prisma.shopCartItem.findFirst({
      where: {
        shoppingCartHeaderId: header.id,
        productVariationId,
      },
    });

    const promos = await this.prisma.promotionalDiscount.findMany({
      where: {
        productVariationId,
        validUntil: { gte: new Date() },
        status: 'ACTIVE',
      },
    });

    if (existing) {
      await this.prisma.shopCartItem.update({
        where: { id: existing.id },
        data: {
          quantity,
          updatedAt: new Date(),
        },
      });

      for (const promo of promos) {
        const meetsRequirement = quantity >= promo.requiredAmount;

        if (meetsRequirement) {
          await this.prisma.shopCartItemDiscount.upsert({
            where: {
              shopCartItemId_promotionalDiscountId: {
                shopCartItemId: existing.id,
                promotionalDiscountId: promo.id,
              },
            },
            create: {
              shopCartItemId: existing.id,
              promotionalDiscountId: promo.id,
              requiredAmount: promo.requiredAmount,
              discountPercentage: promo.discountPercentage ?? undefined,
              bonusQuantity: promo.bonusQuantity ?? undefined,
            },
            update: {
              requiredAmount: promo.requiredAmount,
              discountPercentage: promo.discountPercentage ?? undefined,
              bonusQuantity: promo.bonusQuantity ?? undefined,
              updatedAt: new Date(),
            },
          });
        } else {
          await this.prisma.shopCartItemDiscount.deleteMany({
            where: {
              shopCartItemId: existing.id,
              promotionalDiscountId: promo.id,
            },
          });
        }
      }

      return true;
    }

    const item = await this.prisma.shopCartItem.create({
      data: {
        shoppingCartHeaderId: header.id,
        productVariationId,
        productName: productInfo.name,
        quantity,
        subtotal: quantity * Number(productInfo.price),
      },
    });

    for (const promo of promos) {
      const meetsRequirement = quantity >= promo.requiredAmount;

      if (meetsRequirement) {
        await this.prisma.shopCartItemDiscount.create({
          data: {
            shopCartItemId: item.id,
            promotionalDiscountId: promo.id,
            requiredAmount: promo.requiredAmount,
            discountPercentage: promo.discountPercentage ?? undefined,
            bonusQuantity: promo.bonusQuantity ?? undefined,
          },
        });
      }
    }

    return true;
  }

  async emptyCart(customerId: string) {
    const header = await this.getOrCreateHeader(customerId);
    await this.prisma.shopCartItem.deleteMany({
      where: { shoppingCartHeaderId: header.id },
    });
    return true;
  }
}
