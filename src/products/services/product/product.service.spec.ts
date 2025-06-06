import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new product', async () => {
    const result = await service.create({
      name: 'Test Product',
      description: 'Test Description',
    });

    expect(result.name).toBe('Test Product');
    expect(result.status).toBe('AVAILABLE');
  });

  it('should find all available products', async () => {
    await service.create({ name: 'Product A' });
    await service.create({ name: 'Product B' });

    const products = await service.findAll();
    expect(products.length).toBe(2);
    expect(products.every((p) => p.status === 'AVAILABLE')).toBe(true);
  });

  it('should search for products by name or description', async () => {
    await service.create({
      name: 'Gaming Chair',
      description: 'Ergonomic chair',
    });
    await service.create({ name: 'Office Desk', description: 'Wooden desk' });

    const results = await service.findAll({ search: 'chair' });
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Gaming Chair');
  });

  it('should paginate results correctly', async () => {
    await service.create({ name: 'Product 1' });
    await service.create({ name: 'Product 2' });
    await service.create({ name: 'Product 3' });

    const paginated = await service.findAll({ limit: 2, offset: 1 });
    expect(paginated.length).toBe(2);
  });

  it('should find one product by ID', async () => {
    const created = await service.create({ name: 'Unique Product' });
    const found = await service.findOne(created.id);

    expect(found.name).toBe('Unique Product');
  });

  it('should throw NotFoundException if product not found by ID', async () => {
    await expect(service.findOne(uuidv4())).rejects.toThrow(NotFoundException);
  });

  it('should update an existing product', async () => {
    const created = await service.create({
      name: 'Old Name',
      description: 'Old Desc',
    });

    const updated = await service.update({
      productId: created.id,
      name: 'New Name',
      description: 'New Description',
    });

    expect(updated.name).toBe('New Name');
    expect(updated.description).toBe('New Description');
  });

  it('should throw NotFoundException when updating non-existent product', async () => {
    await expect(
      service.update({ productId: uuidv4(), name: 'X' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should soft delete a product (mark as DELETED)', async () => {
    const product = await service.create({ name: 'Deletable Product' });

    const result = await service.delete(product.id);
    expect(result).toBe(true);

    const deleted = await prisma.product.findUnique({
      where: { id: product.id },
    });
    expect(deleted?.status).toBe('DELETED');
  });

  it('should throw NotFoundException when deleting non-existent product', async () => {
    await expect(service.delete(uuidv4())).rejects.toThrow(NotFoundException);
  });
});
