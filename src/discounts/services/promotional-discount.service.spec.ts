import { Test, TestingModule } from '@nestjs/testing';
import { PromotionalDiscountService } from './promotional-discount.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { CreatePromotionalDiscountInput } from '../dtos/request/create-promotional-discount.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { ManagerSignUpInput } from 'src/auth/dtos/requests/signup/managerSignup.input';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LogInInput } from 'src/auth/dtos/requests/login/login.input';
import { DiscountType, RolePermission } from '@prisma/client';
import { CustomerSignUpInput } from 'src/auth/dtos/requests/signup/customerSignup.input';

describe('PromotionalDiscountService (integration)', () => {
  let service: PromotionalDiscountService;
  let authService: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let authPayload: JwtPayload;
  let productVariationId: string;
  let jwtToken: string;

  const customerLogInInput: LogInInput = {
    email: 'customer@login.com',
    password: 'customerPassword',
  };
  const customerSignUpInput: CustomerSignUpInput = {
    email: customerLogInInput.email,
    password: customerLogInInput.password,
    firstName: 'Customer',
    lastName: 'Test',
  };
  const managerLoginInput: LogInInput = {
    email: 'manager@login.com',
    password: 'managerPassword',
  };
  const managerSignUpInput: ManagerSignUpInput = {
    email: managerLoginInput.email,
    password: managerLoginInput.password,
    firstName: 'Manager',
    lastName: 'Test',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [PromotionalDiscountService, PrismaService],
    }).compile();

    authService = module.get(AuthService);
    service = module.get(PromotionalDiscountService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();

    await prisma.role.create({
      data: {
        name: 'STANDARD_MANAGER_ROLE',
        description: 'Manager role',
        permissions: Object.values(RolePermission),
      },
    });
    await prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER_ROLE',
        description: 'Customer role',
        permissions: Object.values(RolePermission),
      },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Product',
        description: 'desc',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });
    const variation = await prisma.productVariation.create({
      data: {
        name: 'Variation',
        price: 100,
        currencyCode: 'USD',
        availableStock: 20,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        productId: product.id,
      },
    });
    productVariationId = variation.id;

    jwtToken = await authService.registerCustomer(customerSignUpInput);
    jwtToken = await authService.registerManager(
      managerSignUpInput,
      await jwtService.verifyAsync(jwtToken),
    );
    authPayload = await jwtService.verifyAsync(jwtToken);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createPromotion', () => {
    it('should create a promotional discount if user is MANAGER', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Promo Bonus',
        productVariationId,
        discountType: DiscountType.BONUS,
        requiredAmount: 2,
        bonusQuantity: 1,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 5,
      };

      const promo = await service.createPromotion(authPayload, input);
      expect(promo).toHaveProperty('id');
      expect(promo.name).toBe(input.name);
      expect(promo.discountType).toBe('BONUS');
      expect(promo.availableStock).toBe(5);
      expect(promo.requiredAmount).toBe(2);
      expect(promo.validUntil).toEqual(input.validUntil);
    });

    it('should throw ForbiddenException if user is not MANAGER', async () => {
      jwtToken = await authService.login(customerLogInInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Invalid Promo',
        productVariationId,
        discountType: DiscountType.BONUS,
        requiredAmount: 2,
        bonusQuantity: 1,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 10,
      };

      await expect(service.createPromotion(authPayload, input)).rejects.toThrow(
        new ForbiddenException(
          `User type CUSTOMER can not create promotional discount`,
        ),
      );
    });

    it('should handle discountPercentage as number', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Promo Percent',
        productVariationId,
        discountType: DiscountType.PERCENTAGE,
        requiredAmount: 1,
        discountPercentage: 15,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 10,
      };

      const promo = await service.createPromotion(authPayload, input);
      expect(Number(promo.discountPercentage)).toBe(15);
      expect(promo.bonusQuantity).toBeNull();
    });

    it('should allow creating a promo with only requiredAmount (no bonus or percentage)', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Only Required',
        productVariationId,
        discountType: DiscountType.BONUS,
        requiredAmount: 3,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 5,
      };

      const promo = await service.createPromotion(authPayload, input);
      expect(promo.requiredAmount).toBe(3);
      expect(promo.bonusQuantity).toBeNull();
      expect(promo.discountPercentage).toBeNull();
    });

    it('should allow creating a promo with only discountPercentage', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Only Percentage',
        productVariationId,
        requiredAmount: 2,
        discountType: DiscountType.PERCENTAGE,
        discountPercentage: 20,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 3,
      };

      const promo = await service.createPromotion(authPayload, input);
      expect(promo.discountPercentage).toBe(20);
      expect(promo.bonusQuantity).toBeNull();
      expect(promo.requiredAmount).toBeNull();
    });

    it('should convert availableStock from string to number', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Stock As String',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 2,
        bonusQuantity: 1,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 4,
      };

      const promo = await service.createPromotion(authPayload, input);
      expect(promo.availableStock).toBe(4);
    });
  });

  describe('findPromotionsByProduct', () => {
    it('should return promotions if any exist', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      await service.createPromotion(authPayload, {
        name: 'Promo for product',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 2,
        bonusQuantity: 1,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 10,
      });

      const promos = await service.findPromotionsByProduct(productVariationId);
      expect(Array.isArray(promos)).toBe(true);
      expect(promos.length).toBe(1);
    });

    it('should return empty array if no promotions exist', async () => {
      const otherVariation = await prisma.productVariation.create({
        data: {
          name: 'Empty Variation',
          price: 999,
          currencyCode: 'USD',
          availableStock: 0,
          status: 'AVAILABLE',
          statusUpdatedAt: new Date(),
          productId: (await prisma.product.findFirstOrThrow()).id,
        },
      });

      const promos = await service.findPromotionsByProduct(otherVariation.id);
      expect(promos).toEqual([]);
    });
  });

  describe('deletePromotion', () => {
    it('should delete promo if user is MANAGER', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const promo = await service.createPromotion(authPayload, {
        name: 'Promo To Delete',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 2,
        bonusQuantity: 1,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 1,
      });

      const deleted = await service.deletePromotion(promo.id, authPayload);
      expect(deleted).toBe(true);

      const found = await prisma.promotionalDiscount.findUnique({
        where: { id: promo.id },
      });
      expect(found).toBeNull();
    });

    it('should throw ForbiddenException if user is not MANAGER', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const promo = await service.createPromotion(authPayload, {
        name: 'Unauthorized Delete',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 2,
        bonusQuantity: 1,
        validUntil: new Date(Date.now() + 86400000),
        availableStock: 10,
      });

      jwtToken = await authService.login(customerLogInInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      await expect(
        service.deletePromotion(promo.id, authPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw error if promo to delete does not exist', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      await expect(
        service.deletePromotion('non-existing-id', authPayload),
      ).rejects.toThrow();
    });
  });
});
