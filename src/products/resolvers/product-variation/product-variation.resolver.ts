import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductVariationService } from '../../services/product-variation/product-variation.service';
import { CreateProductVariationInput } from '../../dtos/requests/product-variation/create-product-variation.input';
import { UpdateProductVariationInput } from '../../dtos/requests/product-variation/update-product-variation.input';
import { ProductVariation as ProductVariationEntity } from 'generated/prisma';
import { ProductVariation } from '../../models/product-variation/product-variation.model';

@Resolver(() => ProductVariation)
export class ProductVariationResolver {
  constructor(
    private readonly productVariationService: ProductVariationService,
  ) {}

  @Mutation(() => ProductVariation)
  async createProductVariation(
    @Args('input') input: CreateProductVariationInput,
  ): Promise<ProductVariationEntity> {
    return this.productVariationService.createProductVariation(input);
  }

  @Mutation(() => ProductVariation)
  async updateProductVariation(
    @Args('input') input: UpdateProductVariationInput,
  ): Promise<ProductVariationEntity> {
    return this.productVariationService.updateProductVariation(input);
  }

  @Mutation(() => Boolean)
  async deleteProductVariation(
    @Args('productVariationId', { type: () => ID })
    productVariationId: string,
  ): Promise<boolean> {
    return this.productVariationService.deleteProductVariation(
      productVariationId,
    );
  }
}
