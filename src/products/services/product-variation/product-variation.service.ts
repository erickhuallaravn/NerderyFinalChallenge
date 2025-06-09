import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newVariation = await this.prisma.productVariation.create({
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

    if (input.features && input.features.length > 0) {
      await Promise.all(
        input.features.map(async (char) => {
          await this.featureService.create({
            ...char,
            productVariationId: newVariation.id,
          });
        }),
      );
    }

    return newVariation;
  }

  async updateProductVariation(
    input: UpdateProductVariationInput,
  ): Promise<ProductVariation> {
    const existing = await this.prisma.productVariation.findUnique({
      where: { id: input.productVariationId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Variation ID ${input.productVariationId} not found`,
      );
    }

    const updatedVariation = await this.prisma.productVariation.update({
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

    if (input.features && input.features.length > 0) {
      await Promise.all(
        input.features.map(async (char) => {
          await this.featureService.create({
            ...char,
            productVariationId: input.productVariationId,
          });
        }),
      );
    }

    return updatedVariation;
  }

  async deleteProductVariation(productVariationId: string): Promise<boolean> {
    const variation = await this.prisma.productVariation.findUnique({
      where: { id: productVariationId },
    });
    if (!variation) {
      throw new NotFoundException(
        `Variation ID ${productVariationId} not found`,
      );
    }

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
