import { Test, TestingModule } from '@nestjs/testing';
import { OptionValueService } from './option-value.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionService } from './option.service';
import { ProductModule } from 'src/products/products.module';

describe('OptionValueService', () => {
  let service: OptionValueService;
  let prisma: PrismaService;
  let optionService: OptionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
      providers: [PrismaService],
    }).compile();

    service = module.get(OptionValueService);
    prisma = module.get(PrismaService);
    optionService = module.get(OptionService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return an existing option value if it exists', async () => {
    const option = await optionService.findOrCreateOption('size');

    const existingValue = await prisma.optionValue.create({
      data: {
        code: 'M',
        name: 'Medium',
        optionId: option.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.findOrCreateValue('size', 'M');

    expect(result.id).toBe(existingValue.id);
    expect(result.code).toBe('M');
  });

  it('should create a new option value if it does not exist', async () => {
    const option = await optionService.findOrCreateOption('material');

    const result = await service.findOrCreateValue('material', 'leather');

    expect(result).toBeDefined();
    expect(result.code).toBe('leather');
    expect(result.optionId).toBe(option.id);

    const dbEntry = await prisma.optionValue.findUnique({
      where: {
        optionId_code: {
          optionId: option.id,
          code: 'leather',
        },
      },
    });

    expect(dbEntry).not.toBeNull();
    expect(dbEntry?.code).toBe('leather');
  });
});
