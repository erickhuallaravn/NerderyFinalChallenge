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
import { RolePermission } from '@prisma/client';
import { CustomerSignUpInput } from 'src/auth/dtos/requests/signup/customerSignup.input';

describe('PromotionalDiscountService (integration)', () => {
  let service: PromotionalDiscountService;
  let authService: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let authPayload: JwtPayload;
  let productVariationId: string;
  let jwtToken: string;
  let promoId: string;
  const customerLogInInput: LogInInput = {
    email: 'customer@login.com',
    password: 'customerPassword',
  };
  const customerSignUpInput: CustomerSignUpInput = {
    email: customerLogInInput.email,
    password: customerLogInInput.password,
    firstName: 'customerFirstName',
    lastName: 'customerLastName',
  };
  const managerLoginInput: LogInInput = {
    email: 'manager@login.com',
    password: 'managerPassword',
  };
  const managerSignUpInput: ManagerSignUpInput = {
    email: managerLoginInput.email,
    password: managerLoginInput.password,
    firstName: 'managerFirstName',
    lastName: 'managerLastName',
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
        description: 'Standard role for manager',
        permissions: [
          RolePermission.READ,
          RolePermission.UPDATE,
          RolePermission.WRITE,
          RolePermission.DELETE,
        ],
      },
    });
    await prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER_ROLE',
        description: 'Standard role for customer',
        permissions: [
          RolePermission.READ,
          RolePermission.UPDATE,
          RolePermission.WRITE,
          RolePermission.DELETE,
        ],
      },
    });
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'desc',
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
      },
    });
    const variation = await prisma.productVariation.create({
      data: {
        name: 'Test Variation',
        price: 200,
        currencyCode: 'USD',
        availableStock: 50,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        productId: product.id,
      },
    });
    jwtToken = await authService.registerCustomer(customerSignUpInput);
    authPayload = await jwtService.verifyAsync(jwtToken);
    jwtToken = await authService.registerManager(
      managerSignUpInput,
      authPayload,
    );
    authPayload = await jwtService.verifyAsync(jwtToken);
    productVariationId = variation.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createPromotion', () => {
    it('should create a promotional discount if user is MANAGER', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Promo 1',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: Number(null),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
        availableStock: 10,
      };
      const result = await service.createPromotion(authPayload, input);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(input.name);
    });

    it('should throw ForbiddenException if user is not MANAGER', async () => {
      jwtToken = await authService.login(customerLogInInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Invalid Promo',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: Number(null),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
        availableStock: 10,
      };

      await expect(service.createPromotion(authPayload, input)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findPromotionsByProduct', () => {
    it('should return promotional discounts for a product variation', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Promo 1',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: Number(null),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
        availableStock: 10,
      };
      await service.createPromotion(authPayload, input);

      const promos = await service.findPromotionsByProduct(productVariationId);
      expect(Array.isArray(promos)).toBe(true);
      expect(promos.length).toBeGreaterThan(0);
    });
  });

  describe('deletePromotion', () => {
    it('should delete a promotional discount if user is MANAGER', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Promo 1',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: Number(null),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
        availableStock: 10,
      };
      const promo = await service.createPromotion(authPayload, input);
      promoId = promo.id;

      const result = await service.deletePromotion(promoId, authPayload);
      expect(result).toBe(true);

      const deleted = await prisma.promotionalDiscount.findUnique({
        where: { id: promoId },
      });
      expect(deleted).toBeNull();
    });

    it('should throw ForbiddenException if user is not MANAGER', async () => {
      jwtToken = await authService.login(managerLoginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const input: CreatePromotionalDiscountInput = {
        name: 'Promo 1',
        productVariationId,
        discountType: 'BONUS',
        requiredAmount: 3,
        bonusQuantity: 1,
        discountPercentage: Number(null),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
        availableStock: 10,
      };
      const promo = await service.createPromotion(authPayload, input);
      promoId = promo.id;

      jwtToken = await authService.login(customerLogInInput);
      authPayload = await jwtService.verifyAsync(jwtToken);
      await expect(
        service.deletePromotion(promoId, authPayload),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
