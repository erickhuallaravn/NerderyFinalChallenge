import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromotionalDiscountInput } from '../dtos/request/create-promotional-discount.input';
import { RowStatus, UserType } from '@prisma/client';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class PromotionalDiscountService {
  constructor(private prisma: PrismaService) {}

  async createPromotion(
    authPayload: JwtPayload,
    input: CreatePromotionalDiscountInput,
  ) {
    if (authPayload.userType !== UserType.MANAGER) {
      throw new ForbiddenException(
        `User type ${authPayload.userType} can not create promotional discount`,
      );
    }

    const now = new Date();
    return this.prisma.promotionalDiscount.create({
      data: {
        ...input,
        validSince: new Date(),
        status: RowStatus.ACTIVE,
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
