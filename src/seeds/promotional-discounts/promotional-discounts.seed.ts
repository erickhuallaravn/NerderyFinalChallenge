import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DiscountType,
  PromotionalDiscount,
  PromotionStatus,
} from '@prisma/client';

@Injectable()
export class PromotionalDiscountSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const variations = await this.prisma.productVariation.findMany({
      take: 3,
    });

    if (variations.length < 3) {
      console.log(variations);
      throw new Error(
        'The 3 product variations were not found. Seed them first.',
      );
    }

    const discounts = [
      {
        variation: variations[0],
        name: 'Launch Discount',
        type: DiscountType.PERCENTAGE,
        requiredAmount: 2,
        discountPercentage: 10,
        daysValid: 3,
        availableStock: 100,
      },
      {
        variation: variations[1],
        name: 'Buy 2 Get 1 Free',
        type: DiscountType.BONUS,
        requiredAmount: 2,
        bonusQuantity: 1,
        daysValid: 5,
        availableStock: 200,
      },
      {
        variation: variations[2],
        name: 'Flash Sale',
        type: DiscountType.PERCENTAGE,
        requiredAmount: 4,
        discountPercentage: 5,
        daysValid: 1,
        availableStock: 50,
      },
    ];

    const createdDiscounts: PromotionalDiscount[] = [];

    for (const d of discounts) {
      const exists = await this.prisma.promotionalDiscount.findFirst({
        where: {
          productVariationId: d.variation.id,
          name: d.name,
        },
      });

      if (!exists) {
        const discount = await this.prisma.promotionalDiscount.create({
          data: {
            name: d.name,
            productVariationId: d.variation.id,
            discountType: d.type,
            requiredAmount: d.requiredAmount,
            discountPercentage: d.discountPercentage ?? null,
            bonusQuantity: d.bonusQuantity ?? null,
            validUntil: new Date(
              Date.now() + d.daysValid * 24 * 60 * 60 * 1000,
            ),
            availableStock: d.availableStock,
            status: PromotionStatus.ACTIVE,
            statusUpdatedAt: new Date(),
          },
        });

        createdDiscounts.push(discount);
      }
    }

    return createdDiscounts;
  }
}
