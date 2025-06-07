import { Test, TestingModule } from '@nestjs/testing';
import { FeatureService } from './feature.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionValueService } from '../option/option-value.service';
import { AddVariationFeatureInput } from '../../dtos/requests/variation/add-variation-feature.input';
import { ProductModule } from 'src/products/products.module';

describe('FeatureService', () => {
  let service: FeatureService;
  let prisma: PrismaService;
  let optionValueService: OptionValueService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
      providers: [PrismaService],
    }).compile();

    service = module.get(FeatureService);
    prisma = module.get(PrismaService);
    optionValueService = module.get(OptionValueService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new feature if not existing', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product A',
        description: '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Variation A',
        currencyCode: 'USD',
        price: 100,
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        productId: product.id,
      },
    });

    await prisma.option.create({
      data: {
        code: 'color',
        name: 'Color',
      },
    });

    const optionValue = await optionValueService.findOrCreateValue(
      'color',
      'red',
    );

    const input: AddVariationFeatureInput = {
      productVariationId: variation.id,
      optionCode: 'color',
      valueCode: 'red',
    };

    const result = await service.create(input);

    expect(result).toBeDefined();
    expect(result.productVariationId).toBe(variation.id);
    expect(result.optionValueId).toBe(optionValue.id);
    expect(result.status).toBe('ACTIVE');
  });

  it('should return existing feature if already present', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product B',
        description: '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Variation B',
        currencyCode: 'USD',
        price: 120,
        availableStock: 5,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        productId: product.id,
      },
    });

    await prisma.option.create({
      data: {
        code: 'size',
        name: 'Size',
      },
    });

    // Crear el optionValue con el servicio real
    const optionValue = await optionValueService.findOrCreateValue('size', 'M');

    const existingFeature = await prisma.feature.create({
      data: {
        productVariationId: variation.id,
        optionValueId: optionValue.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const input: AddVariationFeatureInput = {
      productVariationId: variation.id,
      optionCode: 'size',
      valueCode: 'M',
    };

    const result = await service.create(input);

    expect(result).toBeDefined();
    expect(result.id).toBe(existingFeature.id);
  });

  it('should soft delete a feature', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product C',
        description: '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Variation C',
        currencyCode: 'USD',
        price: 200,
        availableStock: 2,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        productId: product.id,
      },
    });

    await prisma.option.create({
      data: {
        code: 'material',
        name: 'Material',
      },
    });

    const optionValue = await optionValueService.findOrCreateValue(
      'material',
      'leather',
    );

    const feature = await prisma.feature.create({
      data: {
        productVariationId: variation.id,
        optionValueId: optionValue.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.delete(feature.id);

    expect(result).toBe(true);

    const updatedFeature = await prisma.feature.findUnique({
      where: { id: feature.id },
    });

    expect(updatedFeature?.status).toBe('DELETED');
  });

  it('should create a new feature if existing one is deleted', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product D',
        description: '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Variation D',
        currencyCode: 'USD',
        price: 80,
        availableStock: 8,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        productId: product.id,
      },
    });

    await prisma.option.create({
      data: {
        code: 'fabric',
        name: 'Fabric',
      },
    });

    const optionValue = await optionValueService.findOrCreateValue(
      'fabric',
      'cotton',
    );

    const deletedFeature = await prisma.feature.create({
      data: {
        productVariationId: variation.id,
        optionValueId: optionValue.id,
        status: 'DELETED',
        statusUpdatedAt: new Date(),
      },
    });

    const input: AddVariationFeatureInput = {
      productVariationId: variation.id,
      optionCode: 'fabric',
      valueCode: 'cotton',
    };

    const result = await service.create(input);

    expect(result).toBeDefined();
    expect(result.id).not.toBe(deletedFeature.id);
    expect(result.status).toBe('ACTIVE');
  });

  it('should return false when deleting a non-existent feature', async () => {
    await expect(service.delete('non-existent-id')).rejects.toThrow();
  });
});
