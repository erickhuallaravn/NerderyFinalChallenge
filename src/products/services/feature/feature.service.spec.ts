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
});
