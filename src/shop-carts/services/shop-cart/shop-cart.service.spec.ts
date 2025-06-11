import { Test, TestingModule } from '@nestjs/testing';
import { ShopCartService } from './shop-cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { PASSWORD_ENCRYPT_ROUNDS } from 'src/common/constants/app.constants';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CurrencyCode } from '@prisma/client';

describe('ShopCartService', () => {
  let service: ShopCartService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;

  let customerId: string;
  let authPayload: JwtPayload;
  let productId: string;
  let productVariationId: string;
  let currencyCode: CurrencyCode;
  let variationName: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [ShopCartService, PrismaService],
    }).compile();

    prisma = module.get(PrismaService);
    service = module.get(ShopCartService);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);

    await prisma.cleanDatabase();

    const rawPassword = 'secret123';
    const hashed = await bcrypt.hash(rawPassword, PASSWORD_ENCRYPT_ROUNDS);

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

    const jwtToken = await authService.login({
      email: user.email,
      password: rawPassword,
    });

    authPayload = await jwtService.verifyAsync(jwtToken);

    const product = await prisma.product.create({
      data: {
        name: 'Default Product',
        description: 'Basic description',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    const variation = await prisma.productVariation.create({
      data: {
        productId: product.id,
        name: 'Default Variation',
        price: 100,
        currencyCode: 'USD',
        availableStock: 50,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });

    productId = product.id;
    productVariationId = variation.id;
    currencyCode = variation.currencyCode;
    variationName = variation.name;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create header if not exists', async () => {
    const header = await service.getOrCreateHeader(authPayload);
    expect(header).toBeDefined();
    expect(header.customerId).toBe(customerId);

    const headerAgain = await service['getOrCreateHeader'](authPayload);
    expect(headerAgain.id).toBe(header.id);
  });

  it('should return empty items when no products in cart', async () => {
    const items = await service.getItems(authPayload);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(0);
  });

  it('should throw when product variation does not exist', async () => {
    await expect(
      service.addOrUpdateItem(authPayload, {
        productVariationId: uuidv4(),
        quantity: 1,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  it('should add new item without promo', async () => {
    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 2,
    });

    expect(result).toBe(true);

    const items = await prisma.shopCartItem.findMany();
    expect(items.length).toBe(1);
    expect(items[0].productName).toBe(variationName);
    expect(Number(items[0].subtotal)).toBe(200);
  });

  it('should add item with promo and meet requirements', async () => {
    const promo = await prisma.promotionalDiscount.create({
      data: {
        name: 'Testing promotion',
        productVariationId,
        discountType: 'BOTH',
        requiredAmount: 2,
        bonusQuantity: 1,
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 100,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 3,
    });

    expect(result).toBe(true);

    const discount = await prisma.shopCartItemDiscount.findFirst();
    expect(discount).toBeTruthy();
    expect(discount!.promotionalDiscountId).toBe(promo.id);
  });

  it('should update existing item and remove promo if not applicable', async () => {
    const header = await service['getOrCreateHeader'](authPayload);

    const promo = await prisma.promotionalDiscount.create({
      data: {
        name: 'Testing promotion',
        productVariationId,
        discountType: 'BOTH',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: 15,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 100,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const item = await prisma.shopCartItem.create({
      data: {
        shoppingCartHeaderId: header.id,
        productVariationId,
        productName: variationName,
        quantity: 3,
        subtotal: 300,
        currencyCode,
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

    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 1,
    });

    expect(result).toBe(true);

    const updated = await prisma.shopCartItem.findFirst();
    expect(updated?.quantity).toBe(1);

    const discounts = await prisma.shopCartItemDiscount.findMany();
    expect(discounts.length).toBe(0);
  });

  it('should empty the cart', async () => {
    const header = await service['getOrCreateHeader'](authPayload);

    const variation2 = await prisma.productVariation.create({
      data: {
        productId,
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
          productVariationId,
          productName: variationName,
          quantity: 1,
          subtotal: 100,
          currencyCode: 'USD',
        },
        {
          shoppingCartHeaderId: header.id,
          productVariationId: variation2.id,
          productName: 'Var2',
          quantity: 2,
          subtotal: 400,
          currencyCode: 'USD',
        },
      ],
    });

    const result = await service.emptyCart(authPayload);
    expect(result).toBe(true);

    const items = await prisma.shopCartItem.findMany({
      where: { shoppingCartHeaderId: header.id },
    });

    expect(items.length).toBe(0);
  });

  it('should skip promo if quantity does not meet requirement (new item)', async () => {
    await prisma.promotionalDiscount.create({
      data: {
        name: 'Promo skip test',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 5,
        bonusQuantity: 2,
        validUntil: new Date(Date.now() + 10000),
        availableStock: 50,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 2,
    });

    expect(result).toBe(true);

    const discounts = await prisma.shopCartItemDiscount.findMany();
    expect(discounts.length).toBe(0);
  });

  it('should apply promo with undefined bonus and discount', async () => {
    const promo = await prisma.promotionalDiscount.create({
      data: {
        name: 'Null bonus/discount',
        productVariationId,
        discountType: 'PERCENTAGE',
        requiredAmount: 2,
        discountPercentage: null,
        bonusQuantity: null,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 10,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 3,
    });

    expect(result).toBe(true);

    const discount = await prisma.shopCartItemDiscount.findFirst();
    expect(discount).toBeDefined();
    expect(discount?.promotionalDiscountId).toBe(promo.id);
  });

  it('should apply promo on update if requirement is now met', async () => {
    const promo = await prisma.promotionalDiscount.create({
      data: {
        name: 'Promo for upgrade',
        productVariationId,
        discountType: 'PERCENTAGE',
        requiredAmount: 3,
        discountPercentage: 5,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 20,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 1,
    });

    const result = await service.addOrUpdateItem(authPayload, {
      productVariationId,
      quantity: 3,
    });

    expect(result).toBe(true);

    const discount = await prisma.shopCartItemDiscount.findFirst();
    expect(discount).toBeDefined();
    expect(discount?.promotionalDiscountId).toBe(promo.id);
  });
});
