import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Product as ProductEntity } from '@prisma/client';

import { ProductService } from '../../services/product/product.service';
import { CreateProductInput } from '../../dtos/requests/product/create-product.input';
import { UpdateProductInput } from '../../dtos/requests/product/update-product.input';
import { Product } from '../../models/product/product.model';
import { SearchPaginateProductInput } from 'src/products/dtos/requests/product/search-paginate-product.input';

import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  ValidManagerPayload,
  ValidCustomerPayload,
} from 'src/auth/decorators/valid-auth-payload.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Product])
  async getLikedProducts(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
  ): Promise<ProductEntity[]> {
    return this.productService.findLikedProducts(authPayload);
  }

  @Query(() => [Product])
  async getProducts(
    @Args('input', { type: () => SearchPaginateProductInput, nullable: true })
    input?: SearchPaginateProductInput,
  ): Promise<ProductEntity[]> {
    return this.productService.findAll(input);
  }

  @Query(() => Product)
  async getProductById(
    @Args('product_id', { type: () => ID }) product_id: string,
  ): Promise<ProductEntity> {
    return this.productService.findOne(product_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async createProduct(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductEntity> {
    return this.productService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async updateProduct(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductEntity> {
    return this.productService.update(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteProduct(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('product_id', { type: () => ID }) product_id: string,
  ): Promise<boolean> {
    return this.productService.delete(product_id);
  }
}
