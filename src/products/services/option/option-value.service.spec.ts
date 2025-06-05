import { Test, TestingModule } from '@nestjs/testing';
import { OptionValueService } from './option-value.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionService } from './option.service';

describe('OptionValueService', () => {
  let service: OptionValueService;
  let prisma: PrismaService;

  const mockOptionService = {
    findOrCreateOption: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionValueService,
        PrismaService,
        {
          provide: OptionService,
          useValue: mockOptionService,
        },
      ],
    }).compile();

    service = module.get<OptionValueService>(OptionValueService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return an existing option value if it exists', async () => {
    const option = await prisma.option.create({
      data: {
        code: 'size',
        name: 'Size',
      },
    });

    const existingValue = await prisma.optionValue.create({
      data: {
        code: 'M',
        name: 'Medium',
        optionId: option.id,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    mockOptionService.findOrCreateOption.mockResolvedValue(option);

    const result = await service.findOrCreateValue('size', 'M');

    expect(result.id).toBe(existingValue.id);
    expect(result.code).toBe('M');
    expect(mockOptionService.findOrCreateOption).toHaveBeenCalledWith('size');
  });

  it('should create a new option value if it does not exist', async () => {
    const option = await prisma.option.create({
      data: {
        code: 'material',
        name: 'Material',
      },
    });

    mockOptionService.findOrCreateOption.mockResolvedValue(option);

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
