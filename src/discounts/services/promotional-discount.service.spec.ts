import { Test, TestingModule } from '@nestjs/testing';
import { PromotionalDiscountService } from './promotional-discount.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { CreatePromotionalDiscountInput } from '../dtos/request/create-promotional-discount.input';

describe('PromotionalDiscountService (integration)', () => {
  let service: PromotionalDiscountService;
  let prisma: PrismaService;
  let productVariationId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionalDiscountService, PrismaService],
    }).compile();

    service = module.get(PromotionalDiscountService);
    prisma = module.get(PrismaService);

    await prisma.cleanDatabase();

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

    productVariationId = variation.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createPromotion', () => {
    it('should create a promotional discount if user is CUSTOMER', async () => {
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

      const result = await service.createPromotion(input, 'CUSTOMER');
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(input.name);
    });

    it('should throw ForbiddenException if user is not CUSTOMER', async () => {
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

      await expect(service.createPromotion(input, 'MANAGER')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findPromotionsByProduct', () => {
    it('should return promotional discounts for a product variation', async () => {
      const promos = await service.findPromotionsByProduct(productVariationId);
      expect(Array.isArray(promos)).toBe(true);
      expect(promos.length).toBeGreaterThan(0);
    });
  });

  describe('deletePromotion', () => {
    let promoId: string;

    beforeEach(async () => {
      const promo = await service.createPromotion(
        {
          name: 'Promo to Delete',
          productVariationId,
          discountType: 'BONUS',
          requiredAmount: 2,
          bonusQuantity: 1,
          discountPercentage: Number(null),
          validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
          availableStock: 5,
        },
        'CUSTOMER',
      );
      promoId = promo.id;
    });

    it('should delete a promotional discount if user is CUSTOMER', async () => {
      const result = await service.deletePromotion(promoId, 'CUSTOMER');
      expect(result).toBe(true);

      const deleted = await prisma.promotionalDiscount.findUnique({
        where: { id: promoId },
      });
      expect(deleted).toBeNull();
    });

    it('should throw ForbiddenException if user is not CUSTOMER', async () => {
      await expect(service.deletePromotion(promoId, 'MANAGER')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
