import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from '../../services/product/product.service';
import { CreateProductInput } from '../../dtos/requests/product/create-product.input';
import { UpdateProductInput } from '../../dtos/requests/product/update-product.input';
import { Product as ProductEntity } from '@prisma/client';
import { Product } from '../../models/product/product.model';
import { SearchPaginateProductInput } from 'src/products/dtos/requests/product/search-paginate-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

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

  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductEntity> {
    return this.productService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductEntity> {
    return this.productService.update(input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('product_id', { type: () => ID }) product_id: string,
  ): Promise<boolean> {
    return this.productService.delete(product_id);
  }
}
