import { Test, TestingModule } from '@nestjs/testing';
import { OptionService } from './option.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OptionService', () => {
  let service: OptionService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionService, PrismaService],
    }).compile();

    service = module.get<OptionService>(OptionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return existing option if found', async () => {
    const createdOption = await prisma.option.create({
      data: {
        code: 'color',
        name: 'color',
      },
    });

    const result = await service.findOrCreateOption('color');

    expect(result).toBeDefined();
    expect(result.id).toBe(createdOption.id);
    expect(result.code).toBe('color');
  });

  it('should create and return new option if not found', async () => {
    const code = 'size';

    const result = await service.findOrCreateOption(code);

    expect(result).toBeDefined();
    expect(result.code).toBe(code);
    expect(result.name).toBe(code);

    const dbOption = await prisma.option.findUnique({
      where: { code },
    });
    expect(dbOption).not.toBeNull();
    expect(dbOption?.code).toBe(code);
  });
});
