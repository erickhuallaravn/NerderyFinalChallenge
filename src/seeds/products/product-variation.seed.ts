import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrencyCode, ProductStatus, RowStatus } from '@prisma/client';

@Injectable()
export class ProductVariationSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const product = await this.prisma.product.findFirstOrThrow();

    const variationData = [
      {
        name: 'Test Product - RED M',
        price: 20.0,
        featureCodes: ['RED', 'MEDIUM'],
        availableStock: 100,
      },
      {
        name: 'Test Product - BLUE L',
        price: 22.0,
        featureCodes: ['BLUE', 'LARGE'],
        availableStock: 80,
      },
      {
        name: 'Test Product - BLACK S',
        price: 18.0,
        featureCodes: ['BLACK', 'SMALL'],
        availableStock: 120,
      },
    ];

    for (const variation of variationData) {
      const existing = await this.prisma.productVariation.findFirst({
        where: {
          name: variation.name,
          productId: product.id,
        },
      });

      const createdVariation =
        existing ??
        (await this.prisma.productVariation.create({
          data: {
            name: variation.name,
            price: variation.price,
            currencyCode: CurrencyCode.USD,
            availableStock: variation.availableStock,
            productId: product.id,
            status: ProductStatus.AVAILABLE,
            statusUpdatedAt: new Date(),
          },
        }));

      for (const code of variation.featureCodes) {
        const value = await this.prisma.optionValue.findFirstOrThrow({
          where: { code },
        });

        await this.prisma.feature.upsert({
          where: {
            productVariationId_optionValueId: {
              productVariationId: createdVariation.id,
              optionValueId: value.id,
            },
          },
          update: {},
          create: {
            productVariationId: createdVariation.id,
            optionValueId: value.id,
            status: RowStatus.ACTIVE,
            statusUpdatedAt: new Date(),
          },
        });
      }
    }
  }
}
