import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PromotionalDiscountService } from '../services/promotional-discount.service';
import { CreatePromotionalDiscountInput } from '../dtos/request/create-promotional-discount.input';
import { PromotionalDiscount } from '../models/promotional-discount.model';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { PromotionalDiscount as PromotionalDiscountEntity } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ValidManagerPayload } from 'src/auth/decorators/valid-auth-payload.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Resolver(() => PromotionalDiscount)
@UseGuards(GqlAuthGuard)
export class PromotionalDiscountsResolver {
  constructor(private promotionalDiscountService: PromotionalDiscountService) {}

  @Mutation(() => PromotionalDiscount)
  createPromotionalDiscount(
    @Args('input') input: CreatePromotionalDiscountInput,
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
  ): Promise<PromotionalDiscountEntity> {
    return this.promotionalDiscountService.createPromotion(authPayload, input);
  }

  @Query(() => [PromotionalDiscount])
  getPromotionsByProduct(
    @Args('productVariationId') productVariationId: string,
  ): Promise<PromotionalDiscountEntity[]> {
    return this.promotionalDiscountService.findPromotionsByProduct(
      productVariationId,
    );
  }

  @Mutation(() => Boolean)
  deletePromotionalDiscount(
    @Args('id') id: string,
    @CurrentUser() authPayload: JwtPayload,
  ): Promise<boolean> {
    return this.promotionalDiscountService.deletePromotion(id, authPayload);
  }
}
