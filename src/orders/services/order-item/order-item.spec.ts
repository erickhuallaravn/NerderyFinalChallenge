import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('OrderItemService (integration)', () => {
  let service: OrderItemService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtPayload: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        PrismaService,
        AuthService,
        UserService,
        CustomerService,
        JwtService,
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    await prisma.cleanDatabase();

    const token = await authService.registerCustomer({
      email: 'orderitem@email.com',
      password: '123456',
      firstName: 'OrderItem',
      lastName: 'User',
    });

    jwtPayload = await jwtService.verifyAsync(token);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createOrderWithItem = async () => {
    const variation = await prisma.productVariation.create({
      data: {
        name: 'Var Test',
        price: 150,
        currencyCode: 'USD',
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        product: {
          create: {
            name: 'Product Test',
            description: 'desc',
            status: 'AVAILABLE',
            statusUpdatedAt: new Date(),
          },
        },
      },
    });

    const order = await prisma.orderHeader.create({
      data: {
        customerId: jwtPayload.customerId,
        subtotal: 150,
        statusHistory: {
          create: {
            status: 'PENDING_PAYMENT',
            statusUpdatedAt: new Date(),
          },
        },
        orderItems: {
          create: {
            productName: variation.name,
            productVariationId: variation.id,
            quantity: 2,
            subtotal: 150,
            createdAt: new Date(),
            status: 'ACTIVE',
            statusUpdatedAt: new Date(),
            itemDiscounts: {},
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    return {
      orderItem: order.orderItems[0],
      orderId: order.id,
    };
  };

  describe('getOrderItemById', () => {
    it('should return order item if user is owner', async () => {
      const orderItem = await createOrderWithItem();

      const result = await service.getItemById(
        jwtPayload,
        orderItem.orderItem.id,
      );
      expect(result.id).toBe(orderItem.orderItem.id);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const orderItem = await createOrderWithItem();

      const otherUser = {
        ...jwtPayload,
        customerId: 'other-customer-id',
        userType: 'CUSTOMER',
      };

      await expect(
        service.getItemById(otherUser, orderItem.orderItem.id),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      await expect(
        service.getItemById(jwtPayload, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrderItems', () => {
    it('should return items belonging to user', async () => {
      const { orderId } = await createOrderWithItem();

      const result = await service.getItemsByOrderId(jwtPayload, orderId);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return all items for MANAGER role', async () => {
      const { orderId } = await createOrderWithItem();

      const managerPayload = { ...jwtPayload, userType: 'MANAGER' };
      const result = await service.getItemsByOrderId(managerPayload, orderId);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
