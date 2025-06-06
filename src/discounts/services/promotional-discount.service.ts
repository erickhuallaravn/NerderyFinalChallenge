import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromotionalDiscountInput } from '../dtos/request/create-promotional-discount.input';
import { UserType } from 'src/shared/enums';

@Injectable()
export class PromotionalDiscountService {
  constructor(private prisma: PrismaService) {}

  async createPromotion(
    input: CreatePromotionalDiscountInput,
    userType: UserType,
  ) {
    if (userType !== 'CUSTOMER') {
      throw new ForbiddenException(
        `User type ${userType} can not create promotional discount`,
      );
    }

    const now = new Date();
    const {
      name,
      productVariationId,
      discountType,
      requiredAmount,
      bonusQuantity,
      discountPercentage,
      validUntil,
      availableStock,
    } = { ...input };
    return this.prisma.promotionalDiscount.create({
      data: {
        name,
        productVariationId,
        discountType,
        requiredAmount,
        bonusQuantity,
        discountPercentage,
        validUntil,
        availableStock: availableStock,
        validSince: new Date(),
        createdAt: now,
        status: 'ACTIVE',
        statusUpdatedAt: now,
      },
    });
  }

  async findPromotionsByProduct(productVariationId: string) {
    return this.prisma.promotionalDiscount.findMany({
      where: { productVariationId },
    });
  }

  async deletePromotion(id: string, userType: UserType): Promise<boolean> {
    if (userType !== 'CUSTOMER') {
      throw new ForbiddenException(
        `User type ${userType} can not delete promotional discounts`,
      );
    }

    await this.prisma.promotionalDiscount.delete({
      where: { id },
    });

    return true;
  }
}
