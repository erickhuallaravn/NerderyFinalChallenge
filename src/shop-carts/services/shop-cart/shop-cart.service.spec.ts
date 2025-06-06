import { Test, TestingModule } from '@nestjs/testing';
import { ShopCartService } from './shop-cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PASSWORD_ENCRYPT_ROUNDS } from 'src/common/constants/app.constants';
import * as bcrypt from 'bcrypt';

describe('ShopCartService', () => {
  let service: ShopCartService;
  let prisma: PrismaService;

  let customerId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopCartService, PrismaService],
    }).compile();

    service = module.get<ShopCartService>(ShopCartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();

    const rawPassword: string = 'secret123';
    const hashed: string = await bcrypt.hash(
      rawPassword,
      PASSWORD_ENCRYPT_ROUNDS,
    );

    const user = await prisma.user.create({
      data: {
        email: 'test@login.com',
        passwordHash: hashed,
        userType: 'CUSTOMER',
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        firstName: 'Customer',
        lastName: 'Test',
        address: 'Some address',
        phoneNumber: '123456',
        birthday: new Date(),
      },
    });

    customerId = customer.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create header if not exists', async () => {
    const header = await service['getOrCreateHeader'](customerId);
    expect(header).toBeDefined();
    expect(header.customerId).toBe(customerId);

    const headerAgain = await service['getOrCreateHeader'](customerId);
    expect(headerAgain.id).toBe(header.id);
  });

  it('should return empty items when no products in cart', async () => {
    const items = await service.getItems(customerId);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(0);
  });

  it('should throw when product variation does not exist', async () => {
    await expect(
      service.addOrUpdateItem(customerId, {
        productVariationId: uuidv4(),
        quantity: 1,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should add new item without promo', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Product',
        description: 'product',
        createdAt: new Date(),
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Variation',
        price: 100,
        currencyCode: 'USD',
        availableStock: 50,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.addOrUpdateItem(customerId, {
      productVariationId: variation.id,
      quantity: 2,
    });

    expect(result).toBe(true);

    const items = await prisma.shopCartItem.findMany();
    expect(items.length).toBe(1);
    expect(items[0].productName).toBe('Variation');
    expect(Number(items[0].subtotal)).toBe(200);
  });

  it('should add item with promo and meet requirements', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Promo Product',
        description: 'promo-product',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Promo Variation',
        price: 100,
        currencyCode: 'USD',
        availableStock: 100,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const promo = await prisma.promotionalDiscount.create({
      data: {
        name: 'Testing promotion',
        productVariationId: variation.id,
        discountType: 'BOTH',
        requiredAmount: 2,
        bonusQuantity: 1,
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        availableStock: 100,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.addOrUpdateItem(customerId, {
      productVariationId: variation.id,
      quantity: 3,
    });

    expect(result).toBe(true);

    const discount = await prisma.shopCartItemDiscount.findFirst();
    expect(discount).toBeTruthy();
    expect(discount!.promotionalDiscountId).toBe(promo.id);
  });

  it('should update existing item and remove promo if not applicable', async () => {
    const header = await service['getOrCreateHeader'](customerId);

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'product',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Test Variation',
        price: 100,
        currencyCode: 'USD',
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const promo = await prisma.promotionalDiscount.create({
      data: {
        name: 'Testing promotion',
        productVariationId: variation.id,
        discountType: 'BOTH',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: 15,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        availableStock: 100,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const item = await prisma.shopCartItem.create({
      data: {
        shoppingCartHeaderId: header.id,
        productVariationId: variation.id,
        productName: variation.name,
        quantity: 3,
        subtotal: 300,
      },
    });

    await prisma.shopCartItemDiscount.create({
      data: {
        shopCartItemId: item.id,
        promotionalDiscountId: promo.id,
        requiredAmount: 3,
        discountPercentage: 15,
        bonusQuantity: 1,
      },
    });

    const result = await service.addOrUpdateItem(customerId, {
      productVariationId: variation.id,
      quantity: 1,
    });

    expect(result).toBe(true);

    const updated = await prisma.shopCartItem.findFirst();
    expect(updated?.quantity).toBe(1);

    const discounts = await prisma.shopCartItemDiscount.findMany();
    expect(discounts.length).toBe(0);
  });

  it('should empty the cart', async () => {
    const header = await service['getOrCreateHeader'](customerId);

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'product',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation1 = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Var1',
        price: 100,
        currencyCode: 'USD',
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation2 = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Var2',
        price: 200,
        currencyCode: 'USD',
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    await prisma.shopCartItem.createMany({
      data: [
        {
          shoppingCartHeaderId: header.id,
          productVariationId: variation1.id,
          productName: 'Var1',
          quantity: 1,
          subtotal: 100,
        },
        {
          shoppingCartHeaderId: header.id,
          productVariationId: variation2.id,
          productName: 'Var2',
          quantity: 2,
          subtotal: 400,
        },
      ],
    });

    const result = await service.emptyCart(customerId);
    expect(result).toBe(true);

    const items = await prisma.shopCartItem.findMany({
      where: { shoppingCartHeaderId: header.id },
    });

    expect(items.length).toBe(0);
  });
});
