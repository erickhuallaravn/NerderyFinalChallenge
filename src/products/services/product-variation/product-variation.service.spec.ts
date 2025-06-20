import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationService } from './product-variation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductVariationInput } from 'src/products/dtos/requests/product-variation/create-product-variation.input';
import { UpdateProductVariationInput } from 'src/products/dtos/requests/product-variation/update-product-variation.input';
import { ProductModule } from 'src/products/products.module';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CurrencyCode, ProductStatus } from '@prisma/client';

describe('ProductVariationService', () => {
  let service: ProductVariationService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
      providers: [PrismaService],
    }).compile();

    service = module.get<ProductVariationService>(ProductVariationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a product variation with features', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'test-product',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const input: CreateProductVariationInput = {
      productId: product.id,
      name: 'Test Variation',
      price: 100,
      currencyCode: 'USD',
      availableStock: 10,
      features: [
        {
          optionCode: 'COLOR',
          valueCode: 'RED',
        },
      ],
    };

    const result = await service.create(input);

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Variation');
    expect(Number(result.price)).toBe(100);
    expect(result.status).toBe('AVAILABLE');

    const features = await prisma.feature.findMany({
      where: { productVariationId: result.id },
    });
    expect(features.length).toBe(1);
    expect(features[0].optionValueId).toBeDefined();
  });

  it('should update a product variation and add new features', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Update Test Product',
        description: 'update-test',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Original Variation',
        productId: product.id,
        price: 50,
        currencyCode: 'USD',
        availableStock: 5,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const input: UpdateProductVariationInput = {
      productVariationId: variation.id,
      name: 'Updated Name',
      price: 75,
      availableStock: 20,
      features: [
        {
          optionCode: 'SIZE',
          valueCode: 'M',
        },
      ],
    };

    const updated = await service.update(input);

    expect(updated.name).toBe('Updated Name');
    expect(Number(updated.price)).toBe(75);
    expect(updated.availableStock).toBe(20);

    const features = await prisma.feature.findMany({
      where: { productVariationId: variation.id },
    });
    expect(features.some((f) => f.optionValueId)).toBe(true);
  });

  it('should throw if variation to update does not exist', async () => {
    await expect(
      service.update({
        productVariationId: uuidv4(),
        name: 'Name',
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  it('should delete a variation by marking it DELETED', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Delete Test Product',
        description: 'delete-product',
        status: ProductStatus.AVAILABLE,
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'To Be Deleted',
        productId: product.id,
        price: 120,
        currencyCode: CurrencyCode.USD,
        availableStock: 3,
        status: ProductStatus.AVAILABLE,
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.delete(variation.id);
    expect(result).toBe(true);

    const deleted = await prisma.productVariation.findUnique({
      where: { id: variation.id },
    });

    expect(deleted?.status).toBe('DELETED');
  });

  it('should throw if trying to delete non-existing variation', async () => {
    await expect(service.delete(uuidv4())).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
  });
});
