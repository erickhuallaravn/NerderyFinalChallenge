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
    return this.prisma.promotionalDiscount.create({
      data: {
        ...input,
        validSince: new Date(),
        status: 'ACTIVE',
        statusUpdatedAt: now,
        createdAt: now,
      },
    });
  }

  async findPromotionsByProduct(productVariationId: string) {
    return this.prisma.promotionalDiscount.findMany({
      where: { productVariationId },
    });
  }

  async deletePromotion(id: string, userType: string): Promise<boolean> {
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
