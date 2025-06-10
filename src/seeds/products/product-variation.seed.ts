import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CurrencyCode,
  ProductStatus,
  ProductVariation,
  RowStatus,
} from '@prisma/client';

@Injectable()
export class ProductVariationSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const products = await this.prisma.product.findMany();
    const tshirt = products.find((p) => p.name === 'Basic T-Shirt');
    const hoodie = products.find((p) => p.name === 'Hoodie');
    const sneakers = products.find((p) => p.name === 'Sneakers');
    if (!tshirt || !hoodie || !sneakers) return;

    const colorOption = await this.prisma.option.upsert({
      where: { code: 'COLOR' },
      update: {},
      create: { name: 'Color', code: 'COLOR' },
    });

    const sizeOption = await this.prisma.option.upsert({
      where: { code: 'SIZE' },
      update: {},
      create: { name: 'Size', code: 'SIZE' },
    });

    const red = await this.upsertOptionValue('RED', 'Red', colorOption.id);
    const blue = await this.upsertOptionValue('BLUE', 'Blue', colorOption.id);
    const black = await this.upsertOptionValue(
      'BLACK',
      'Black',
      colorOption.id,
    );

    const small = await this.upsertOptionValue('SMALL', 'S', sizeOption.id);
    const medium = await this.upsertOptionValue('MEDIUM', 'M', sizeOption.id);
    const large = await this.upsertOptionValue('LARGE', 'L', sizeOption.id);

    const variationsData = [
      {
        name: 'Red T-Shirt - M',
        price: 19.99,
        productId: tshirt.id,
        featureValueIds: [red.id, medium.id],
      },
      {
        name: 'Black Hoodie - L',
        price: 39.99,
        productId: hoodie.id,
        featureValueIds: [black.id, large.id],
      },
      {
        name: 'Blue Sneakers - S',
        price: 59.99,
        productId: sneakers.id,
        featureValueIds: [blue.id, small.id],
      },
    ];

    for (const variation of variationsData) {
      const existing = await this.prisma.productVariation.findFirst({
        where: {
          name: variation.name,
          productId: variation.productId,
        },
      });

      let createdVariation: ProductVariation;
      if (!existing) {
        createdVariation = await this.prisma.productVariation.create({
          data: {
            name: variation.name,
            price: variation.price,
            currencyCode: CurrencyCode.USD,
            availableStock: 50,
            productId: variation.productId,
            status: ProductStatus.AVAILABLE,
            statusUpdatedAt: new Date(),
          },
        });
      } else {
        createdVariation = existing;
      }

      for (const valueId of variation.featureValueIds) {
        const exists = await this.prisma.feature.findFirst({
          where: {
            productVariationId: createdVariation.id,
            optionValueId: valueId,
          },
        });

        if (!exists) {
          await this.prisma.feature.create({
            data: {
              productVariationId: createdVariation.id,
              optionValueId: valueId,
              status: RowStatus.ACTIVE,
              statusUpdatedAt: new Date(),
            },
          });
        }
      }
    }
  }

  private async upsertOptionValue(
    code: string,
    name: string,
    optionId: string,
  ) {
    return this.prisma.optionValue.upsert({
      where: {
        optionId_code: {
          optionId,
          code,
        },
      },
      update: {},
      create: {
        name,
        code,
        optionId,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });
  }
}
