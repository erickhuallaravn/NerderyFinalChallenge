import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ProductFileService } from '../../services/product-file/product-file.service';
import { UploadProductFileInput } from '../../dtos/requests/product-file/upload-product-file.input';
import { ProductFile as ProductFileEntity } from '@prisma/client';
import { ProductFile } from '../../models/product-file/product-file.model';

@Resolver(() => ProductFile)
export class ProductFileResolver {
  constructor(private readonly productFileService: ProductFileService) {}

  @Mutation(() => ProductFile)
  async uploadProductFile(
    @Args('input') input: UploadProductFileInput,
  ): Promise<ProductFileEntity> {
    return this.productFileService.upload(input);
  }

  @Mutation(() => Boolean)
  async deleteProductFile(
    @Args('productFileId') productFileId: string,
  ): Promise<boolean> {
    return this.productFileService.delete(productFileId);
  }
}
