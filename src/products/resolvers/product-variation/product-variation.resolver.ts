import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductVariation as ProductVariationEntity } from '@prisma/client';

import { ProductVariationService } from '../../services/product-variation/product-variation.service';
import { CreateProductVariationInput } from '../../dtos/requests/product-variation/create-product-variation.input';
import { UpdateProductVariationInput } from '../../dtos/requests/product-variation/update-product-variation.input';
import { ProductVariation } from '../../models/product-variation/product-variation.model';

import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  ValidCustomerPayload,
  ValidManagerPayload,
} from 'src/auth/decorators/valid-auth-payload.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Resolver(() => ProductVariation)
export class ProductVariationResolver {
  constructor(
    private readonly productVariationService: ProductVariationService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductVariation)
  async createProductVariation(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('input') input: CreateProductVariationInput,
  ): Promise<ProductVariationEntity> {
    return this.productVariationService.create(input);
  }

  @Mutation(() => ProductVariation)
  async updateProductVariation(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('input') input: UpdateProductVariationInput,
  ): Promise<ProductVariationEntity> {
    return this.productVariationService.update(input);
  }

  @Mutation(() => Boolean)
  async deleteProductVariation(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('productVariationId', { type: () => ID })
    productVariationId: string,
  ): Promise<boolean> {
    return this.productVariationService.delete(productVariationId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async markVariationAsLiked(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
    @Args('productVariationId', { type: () => ID }) productVariationId: string,
  ): Promise<boolean> {
    return this.productVariationService.markLiked(
      productVariationId,
      authPayload,
    );
  }
}
