import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationService } from './product-variation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FeatureService } from '../feature/feature.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductVariationInput } from 'src/products/dtos/requests/product-variation/create-product-variation.input';
import { UpdateProductVariationInput } from 'src/products/dtos/requests/product-variation/update-product-variation.input';

describe('ProductVariationService', () => {
  let service: ProductVariationService;
  let prisma: PrismaService;
  let featureService: FeatureService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariationService,
        PrismaService,
        {
          provide: FeatureService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductVariationService>(ProductVariationService);
    prisma = module.get<PrismaService>(PrismaService);
    featureService = module.get<FeatureService>(FeatureService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    jest.clearAllMocks();
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

    const result = await service.createProductVariation(input);

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Variation');
    expect(result.price).toBe(100);
    expect(result.status).toBe('AVAILABLE');
    expect(featureService.create).toHaveBeenCalledWith({
      productVariationId: result.id,
      optionCode: 'COLOR',
      valueCode: 'RED',
    });
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

    const updated = await service.updateProductVariation(input);

    expect(updated.name).toBe('Updated Name');
    expect(updated.price).toBe(75);
    expect(updated.availableStock).toBe(20);
    expect(featureService.create).toHaveBeenCalledWith({
      productVariationId: variation.id,
      optionCode: 'SIZE',
      valueCode: 'M',
    });
  });

  it('should throw if variation to update does not exist', async () => {
    await expect(
      service.updateProductVariation({
        productVariationId: 'nonexistent',
        name: 'Name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a variation by marking it DELETED', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Delete Test Product',
        description: 'delete-product',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'To Be Deleted',
        productId: product.id,
        price: 120,
        currencyCode: 'USD',
        availableStock: 3,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.deleteProductVariation(variation.id);
    expect(result).toBe(true);

    const deleted = await prisma.productVariation.findUnique({
      where: { id: variation.id },
    });

    expect(deleted?.status).toBe('DELETED');
  });

  it('should throw if trying to delete non-existing variation', async () => {
    await expect(service.deleteProductVariation('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
