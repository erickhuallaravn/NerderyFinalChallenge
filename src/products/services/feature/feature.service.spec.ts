import { Test, TestingModule } from '@nestjs/testing';
import { FeatureService } from './feature.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionValueService } from '../option/option-value.service';
import { AddVariationFeatureInput } from '../../dtos/requests/variation/add-variation-feature.input';

describe('FeatureService', () => {
  let service: FeatureService;
  let prisma: PrismaService;

  const mockOptionValueService = {
    findOrCreateValue: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        PrismaService,
        {
          provide: OptionValueService,
          useValue: mockOptionValueService,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new feature if not existing', async () => {
    // First, create required entities
    const product = await prisma.product.create({
      data: {
        name: 'Product A',
        description: '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Test product variation',
        currencyCode: 'USD',
        productId: product.id,
        price: 100,
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const option = await prisma.option.create({
      data: {
        code: 'color',
        name: 'Color',
      },
    });

    const optionValue = await prisma.optionValue.create({
      data: {
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
        code: 'red',
        name: 'Red',
        optionId: option.id,
      },
    });

    mockOptionValueService.findOrCreateValue.mockResolvedValue(optionValue);

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Test product variation',
        currencyCode: 'USD',
        productId: product.id,
        price: 120,
        availableStock: 5,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const option = await prisma.option.create({
      data: { code: 'size', name: 'Size' },
    });

    const optionValue = await prisma.optionValue.create({
      data: {
        code: 'M',
        name: 'Medium',
        optionId: option.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const existingFeature = await prisma.feature.create({
      data: {
        productVariationId: variation.id,
        optionValueId: optionValue.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    mockOptionValueService.findOrCreateValue.mockResolvedValue(optionValue);

    const input: AddVariationFeatureInput = {
      productVariationId: variation.id,
      optionCode: 'size',
      valueCode: 'M',
    };

    const result = await service.create(input);

    expect(result.id).toBe(existingFeature.id);
  });

  it('should soft delete a feature', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product C',
        description: '',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        name: 'Test product variation',
        currencyCode: 'USD',
        productId: product.id,
        price: 200,
        availableStock: 2,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const option = await prisma.option.create({
      data: { code: 'material', name: 'Material' },
    });

    const optionValue = await prisma.optionValue.create({
      data: {
        code: 'leather',
        name: 'Leather',
        optionId: option.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

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

    const updated = await prisma.feature.findUnique({
      where: { id: feature.id },
    });
    expect(updated?.status).toBe('DELETED');
  });
});
