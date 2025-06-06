import { Test, TestingModule } from '@nestjs/testing';
import { ProductFileService } from './product-file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { Readable } from 'stream';

describe('ProductFileService', () => {
  let service: ProductFileService;
  let prisma: PrismaService;
  let cloudinary: CloudinaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductFileService,
        PrismaService,
        {
          provide: CloudinaryService,
          useValue: {
            upload: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductFileService>(ProductFileService);
    prisma = module.get<PrismaService>(PrismaService);
    cloudinary = module.get<CloudinaryService>(CloudinaryService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should upload a product file', async () => {
    const variation = await prisma.productVariation.create({
      data: {
        productId: 'fake-product-id',
        name: 'Test Variation',
        price: 10.0,
        currencyCode: 'PEN',
        availableStock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const mockFile = {
      createReadStream: () => Readable.from(['test']),
      filename: 'test.jpg',
      mimetype: 'image/jpeg',
      encoding: '7bit',
    };

    (cloudinary.upload as jest.Mock).mockResolvedValue({
      format: 'jpg',
      secure_url: 'https://cloudinary.com/test.jpg',
    });

    const result = await service.upload({
      file: Promise.resolve(mockFile as any),
      productVariationId: variation.id,
      altText: 'Test image',
    });

    expect(result).toBeDefined();
    expect(result.url).toBe('https://cloudinary.com/test.jpg');
    expect(result.altText).toBe('Test image');
    expect(result.fileExtension).toBe('jpg');
  });

  it('should return false if product file does not exist', async () => {
    const result = await service.delete('non-existent-id');
    expect(result).toBe(false);
  });

  it('should delete a product file and call cloudinary delete', async () => {
    const file = await prisma.productFile.create({
      data: {
        productVariationId: 'some-id',
        fileExtension: 'png',
        url: 'https://res.cloudinary.com/demo/image/upload/products/test-image.png',
        altText: 'Sample image',
      },
    });

    (cloudinary.delete as jest.Mock).mockResolvedValue(true);

    const result = await service.delete(file.id);

    expect(result).toBe(true);
    expect(cloudinary.delete).toHaveBeenCalledWith('products/test-image');

    const deleted = await prisma.productFile.findUnique({
      where: { id: file.id },
    });
    expect(deleted).toBeNull();
  });
});
