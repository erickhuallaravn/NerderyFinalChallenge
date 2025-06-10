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
import { ValidManagerPayload } from 'src/auth/decorators/valid-auth-payload.decorator';

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
    return this.productVariationService.createProductVariation(input);
  }

  @Mutation(() => ProductVariation)
  async updateProductVariation(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('input') input: UpdateProductVariationInput,
  ): Promise<ProductVariationEntity> {
    return this.productVariationService.updateProductVariation(input);
  }

  @Mutation(() => Boolean)
  async deleteProductVariation(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('productVariationId', { type: () => ID })
    productVariationId: string,
  ): Promise<boolean> {
    return this.productVariationService.deleteProductVariation(
      productVariationId,
    );
  }
}
