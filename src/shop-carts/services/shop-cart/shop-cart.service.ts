import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToShopCartInput } from '../../dtos/requests/shop-cart/add-to-shop-cart.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { RowStatus } from '@prisma/client';

@Injectable()
export class ShopCartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateHeader(authPayload: JwtPayload) {
    const customerId = authPayload.customerId!;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const header = await this.prisma.shopCartHeader.upsert({
      where: { customerId },
      create: {
        name: 'default',
        dueDate,
        total: 0.0,
        currencyCode: 'PEN',
        customerId,
      },
      update: {},
    });

    return header;
  }

  async getItems(authPayload: JwtPayload) {
    const header = await this.getOrCreateHeader(authPayload);

    return this.prisma.shopCartItem.findMany({
      where: { shoppingCartHeaderId: header.id },
      include: {
        itemDiscounts: true,
      },
    });
  }

  async addOrUpdateItem(
    authPayload: JwtPayload,
    input: AddToShopCartInput,
  ): Promise<boolean> {
    const { productVariationId, quantity } = input;
    const productInfo = await this.prisma.productVariation.findUnique({
      where: { id: productVariationId },
      select: { name: true, price: true, currencyCode: true },
    });

    if (!productInfo)
      throw new NotFoundException('The product specified does not exist.');

    const header = await this.getOrCreateHeader(authPayload);

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
        status: RowStatus.ACTIVE,
      },
    });

    const getDiscountPercentage = (quantity: number): number => {
      const valid = promos.find(
        (p) => quantity >= p.requiredAmount && p.discountPercentage != null,
      );
      return valid?.discountPercentage?.toNumber() ?? 0;
    };

    const discountPct = getDiscountPercentage(quantity);
    const price = Number(productInfo.price);
    const discountedSubtotal = quantity * price * (1 - discountPct / 100);

    if (existing) {
      await this.prisma.shopCartItem.update({
        where: { id: existing.id },
        data: {
          quantity,
          subtotal: discountedSubtotal,
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

      await this.recalculateHeaderTotal(header.id);
      return true;
    }

    const item = await this.prisma.shopCartItem.create({
      data: {
        shoppingCartHeaderId: header.id,
        productVariationId,
        productName: productInfo.name,
        quantity,
        subtotal: discountedSubtotal,
        currencyCode: productInfo.currencyCode,
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

    await this.recalculateHeaderTotal(header.id);
    return true;
  }

  async recalculateHeaderTotal(headerId: string) {
    const items = await this.prisma.shopCartItem.findMany({
      where: { shoppingCartHeaderId: headerId },
    });

    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

    await this.prisma.shopCartHeader.update({
      where: { id: headerId },
      data: {
        total,
        updatedAt: new Date(),
      },
    });
  }

  async emptyCart(authPayload: JwtPayload) {
    const header = await this.getOrCreateHeader(authPayload);
    await this.prisma.shopCartItem.deleteMany({
      where: { shoppingCartHeaderId: header.id },
    });

    await this.prisma.shopCartHeader.update({
      where: { id: header.id },
      data: {
        total: 0,
        updatedAt: new Date(),
      },
    });

    return true;
  }
}
