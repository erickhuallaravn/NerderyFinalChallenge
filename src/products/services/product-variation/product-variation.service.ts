import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductVariationInput } from '../../dtos/requests/product-variation/create-product-variation.input';
import { UpdateProductVariationInput } from '../../dtos/requests/product-variation/update-product-variation.input';
import { ProductStatus, ProductVariation, RowStatus } from '@prisma/client';
import { FeatureService } from '../feature/feature.service';

@Injectable()
export class ProductVariationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly featureService: FeatureService,
  ) {}

  async createProductVariation(
    input: CreateProductVariationInput,
  ): Promise<ProductVariation> {
    return this.prisma.$transaction(async (tx) => {
      const newVariation = await tx.productVariation.create({
        data: {
          productId: input.productId,
          name: input.name,
          price: input.price,
          currencyCode: input.currencyCode,
          availableStock: input.availableStock,
          status: ProductStatus.AVAILABLE,
          statusUpdatedAt: new Date(),
        },
      });

      if (input.features?.length) {
        for (const feature of input.features) {
          await this.featureService.createWithTx(tx, {
            ...feature,
            productVariationId: newVariation.id,
          });
        }
      }

      return newVariation;
    });
  }

  async updateProductVariation(
    input: UpdateProductVariationInput,
  ): Promise<ProductVariation> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.productVariation.findUniqueOrThrow({
        where: { id: input.productVariationId },
      });

      const updatedVariation = await tx.productVariation.update({
        where: { id: input.productVariationId },
        data: {
          name: input.name ?? existing.name,
          price: input.price ?? existing.price,
          currencyCode: input.currencyCode ?? existing.currencyCode,
          availableStock: input.availableStock ?? existing.availableStock,
          status: input.status ?? existing.status,
          updatedAt: new Date(),
          statusUpdatedAt: new Date(),
        },
      });

      if (input.features?.length) {
        for (const feature of input.features) {
          await this.featureService.createWithTx(tx, {
            ...feature,
            productVariationId: input.productVariationId,
          });
        }
      }

      return updatedVariation;
    });
  }

  async deleteProductVariation(productVariationId: string): Promise<boolean> {
    await this.prisma.productVariation.findUniqueOrThrow({
      where: { id: productVariationId },
    });

    await this.prisma.productVariation.update({
      where: { id: productVariationId },
      data: {
        status: RowStatus.DELETED,
        statusUpdatedAt: new Date(),
      },
    });

    return true;
  }
}
