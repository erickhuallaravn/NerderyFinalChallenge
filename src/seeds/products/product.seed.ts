import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const existing = await this.prisma.product.findMany();

    const ensureProduct = async (name: string, description: string) => {
      const found = existing.find((p) => p.name === name);
      if (!found) {
        await this.prisma.product.create({
          data: {
            name,
            description,
            status: ProductStatus.AVAILABLE,
            statusUpdatedAt: new Date(),
          },
        });
      }
    };

    await ensureProduct('Basic T-Shirt', 'Cotton t-shirt with simple design.');
    await ensureProduct('Hoodie', 'Warm hoodie available in multiple colors.');
    await ensureProduct('Sneakers', 'Comfortable sneakers for everyday use.');
  }
}
