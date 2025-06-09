import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductInput } from '../../dtos/requests/product/create-product.input';
import { UpdateProductInput } from '../../dtos/requests/product/update-product.input';
import { Product, ProductStatus, RowStatus } from '@prisma/client';
import { SearchPaginateProductInput } from 'src/products/dtos/requests/product/search-paginate-product.input';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(input?: SearchPaginateProductInput): Promise<Product[]> {
    const { search, limit, offset } = input || {};

    return this.prisma.product.findMany({
      where: {
        status: ProductStatus.AVAILABLE,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              {
                variations: {
                  some: {
                    features: {
                      some: {
                        OR: [
                          {
                            optionValue: {
                              name: { contains: search, mode: 'insensitive' },
                            },
                          },
                          {
                            optionValue: {
                              option: {
                                name: { contains: search, mode: 'insensitive' },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ]
          : undefined,
      },
      include: {
        variations: {
          where: { status: ProductStatus.AVAILABLE },
          include: {
            productFiles: true,
            features: {
              where: { status: RowStatus.ACTIVE },
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
      take: limit,
      skip: offset,
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
        status: ProductStatus.AVAILABLE,
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
        status: RowStatus.DELETED,
        statusUpdatedAt: new Date(),
      },
    });
    return true;
  }
}
