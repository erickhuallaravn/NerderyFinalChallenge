import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    await this.ensureBasicOptions();
    const product = await this.prisma.product.findFirst();
    if (product === null) {
      return this.prisma.product.create({
        data: {
          name: 'Test Product',
          description: 'A product with 3 variations for testing.',
          status: ProductStatus.AVAILABLE,
          statusUpdatedAt: new Date(),
        },
      });
    }
    return product;
  }

  private async ensureBasicOptions() {
    const color = await this.prisma.option.upsert({
      where: { code: 'COLOR' },
      update: {},
      create: { name: 'Color', code: 'COLOR' },
    });

    const size = await this.prisma.option.upsert({
      where: { code: 'SIZE' },
      update: {},
      create: { name: 'Size', code: 'SIZE' },
    });

    const values = [
      { code: 'RED', name: 'Red', optionId: color.id },
      { code: 'BLUE', name: 'Blue', optionId: color.id },
      { code: 'BLACK', name: 'Black', optionId: color.id },
      { code: 'SMALL', name: 'S', optionId: size.id },
      { code: 'MEDIUM', name: 'M', optionId: size.id },
      { code: 'LARGE', name: 'L', optionId: size.id },
    ];

    for (const value of values) {
      await this.prisma.optionValue.upsert({
        where: {
          optionId_code: {
            optionId: value.optionId,
            code: value.code,
          },
        },
        update: {},
        create: {
          name: value.name,
          code: value.code,
          optionId: value.optionId,
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });
    }
  }
}
