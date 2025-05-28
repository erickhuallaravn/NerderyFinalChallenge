import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductInput } from '../../dtos/requests/product/create-product.input';
import { UpdateProductInput } from '../../dtos/requests/product/update-product.input';
import { Product } from 'generated/prisma';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        variations: {
          where: {
            status: 'AVAILABLE',
          },
          include: {
            productFiles: true,
            features: {
              where: {
                status: 'ACTIVE',
              },
              include: {
                optionValue: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOne(product_id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: product_id },
      include: {
        variations: true,
      },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    return product;
  }

  async create(newProductInfo: CreateProductInput): Promise<Product> {
    return await this.prisma.product.create({
      data: {
        name: newProductInfo.name,
        description: newProductInfo.description ?? '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(input: UpdateProductInput): Promise<Product> {
    const existing = await this.prisma.product.findUnique({
      where: { id: input.productId },
    });
    if (!existing)
      throw new NotFoundException(
        `Product with ID ${input.productId} not found`,
      );

    return await this.prisma.product.update({
      where: { id: input.productId },
      data: {
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        status: input.status ?? existing.status,
        statusUpdatedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async delete(product_id: string): Promise<boolean> {
    const existing = await this.prisma.product.findUnique({
      where: { id: product_id },
    });
    if (!existing)
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    await this.prisma.product.update({
      where: { id: product_id },
      data: {
        status: 'DELETED',
        statusUpdatedAt: new Date(),
      },
    });
    return true;
  }
}
