/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductFileService } from './product-file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductModule } from 'src/products/products.module';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

describe('ProductFileService', () => {
  let service: ProductFileService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
      providers: [
        PrismaService,
        {
          provide: CloudinaryService,
          useValue: {
            upload: jest.fn().mockResolvedValue({
              secure_url:
                'https://res.cloudinary.com/demo/image/upload/products/test-image.jpg',
              public_id: 'products/test-image',
            }),
            delete: jest.fn().mockResolvedValue({ result: 'ok' }),
          },
        },
      ],
    }).compile();

    service = module.get(ProductFileService);
    prisma = module.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should upload a product file', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'test product desc',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Test Variation',
        price: 10.0,
        currencyCode: 'PEN',
        availableStock: 100,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const imagePath = path.resolve(__dirname, 'fixtures', 'test-image.jpg');
    const fileStream = fs.createReadStream(imagePath);

    const mockFile = {
      createReadStream: () => fileStream,
      filename: 'test-image.jpg',
      mimetype: 'image/jpeg',
      encoding: '7bit',
    };

    const result = await service.upload({
      file: Promise.resolve(mockFile as any),
      productVariationId: variation.id,
      altText: 'Test image',
    });

    expect(result).toBeDefined();
    expect(result.altText).toBe('Test image');
    expect(result.fileExtension).toBe('jpg');
    expect(result.url).toMatch(/^https?:\/\//);

    const fileDb = await prisma.productFile.findUnique({
      where: { id: result.id },
    });
    expect(fileDb).not.toBeNull();
    expect(fileDb?.url).toBe(result.url);
  });

  it('should return false if product file does not exist', async () => {
    const result = await service.delete(uuidv4());
    expect(result).toBe(false);
  });

  it('should delete a product file and call cloudinary delete', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product for deletion',
        description: 'desc',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Variation for deletion',
        price: 15.0,
        currencyCode: 'USD',
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const file = await prisma.productFile.create({
      data: {
        productVariationId: variation.id,
        fileExtension: 'png',
        url: 'https://res.cloudinary.com/demo/image/upload/products/test-image.png',
        altText: 'Sample image',
      },
    });

    const result = await service.delete(file.id);
    expect(result).toBe(true);

    const deleted = await prisma.productFile.findUnique({
      where: { id: file.id },
    });
    expect(deleted).toBeNull();
  });
});
