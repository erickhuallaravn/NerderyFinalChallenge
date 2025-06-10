import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ProductFile as ProductFileEntity } from '@prisma/client';

import { ProductFileService } from '../../services/product-file/product-file.service';
import { UploadProductFileInput } from '../../dtos/requests/product-file/upload-product-file.input';
import { ProductFile } from '../../models/product-file/product-file.model';

import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { ValidManagerPayload } from 'src/auth/decorators/valid-auth-payload.decorator';

@Resolver(() => ProductFile)
export class ProductFileResolver {
  constructor(private readonly productFileService: ProductFileService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductFile)
  async uploadProductFile(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('input') input: UploadProductFileInput,
  ): Promise<ProductFileEntity> {
    return this.productFileService.upload(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteProductFile(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Args('productFileId') productFileId: string,
  ): Promise<boolean> {
    return this.productFileService.delete(productFileId);
  }
}
