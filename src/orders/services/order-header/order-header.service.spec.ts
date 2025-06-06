import { Test, TestingModule } from '@nestjs/testing';
import { OrderHeaderService } from './order-header.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderHeaderInput } from '../../dtos/requests/order-header/update-order-header.input';

describe('OrderHeaderService (integration)', () => {
  let service: OrderHeaderService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtPayload: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderHeaderService,
        PrismaService,
        AuthService,
        UserService,
        CustomerService,
        JwtService,
      ],
    }).compile();

    service = module.get<OrderHeaderService>(OrderHeaderService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    await prisma.cleanDatabase();

    const token = await authService.registerCustomer({
      email: 'test@email.com',
      password: '123456',
      firstName: 'Test',
      lastName: 'User',
    });

    jwtPayload = await jwtService.verifyAsync(token);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createOrder', () => {
    it('should throw BadRequest if shopping cart is empty', async () => {
      await expect(service.createOrder(jwtPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create an order from cart items', async () => {
      // Prepara carrito con productos y descuentos
      const variation = await prisma.productVariation.create({
        data: {
          name: 'Var A',
          product: {
            create: {
              name: 'Product A',
              description: 'desc',
              status: 'AVAILABLE',
              statusUpdatedAt: new Date(),
            },
          },
          price: 100,
          currencyCode: 'USD',
          availableStock: 10,
          status: 'AVAILABLE',
          statusUpdatedAt: new Date(),
        },
      });

      await prisma.shopCartHeader.create({
        data: {
          customerId: jwtPayload.customerId,
          cartItems: {
            create: [
              {
                productVariationId: variation.id,
                productName: variation.name,
                quantity: 2,
                subtotal: 200,
                itemDiscounts: {
                  create: [
                    {
                      promotionalDiscountId: 'promo-1',
                      requiredAmount: 2,
                      discountPercentage: 10,
                      bonusQuantity: 0,
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      const order = await service.createOrder(jwtPayload, 'Primera orden');
      expect(order).toBeDefined();
      expect(order.orderItems.length).toBe(1);
      expect(order.statusHistory.length).toBe(1);
    });
  });

  describe('getOrders', () => {
    it('should return orders for authenticated user', async () => {
      const orders = await service.getOrders(jwtPayload);
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
    });
  });

  describe('updateOrder', () => {
    it('should update an order if it is pending and user is manager', async () => {
      const order = await service.createOrder(jwtPayload);
      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          status: 'PENDING_PAYMENT',
          statusUpdatedAt: new Date(),
        },
      });

      jwtPayload.userType = 'MANAGER'; // Simula rol con permisos

      const input: UpdateOrderHeaderInput = {
        status: 'PENDING_PAYMENT',
        notes: 'Actualización de prueba',
      };

      const updatedOrder = await service.updateOrder(
        jwtPayload,
        order.id,
        input,
      );
      expect(updatedOrder.statusHistory.at(-1)?.status).toBe('PENDING_PAYMENT');
    });

    it('should throw if status is not PENDING_PAYMENT', async () => {
      const order = await service.createOrder(jwtPayload);

      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          status: 'SHIPPED',
          statusUpdatedAt: new Date(),
        },
      });

      jwtPayload.userType = 'MANAGER';

      await expect(
        service.updateOrder(jwtPayload, order.id, {
          status: 'PENDING_PAYMENT',
          notes: 'No se puede',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('anulateOrder', () => {
    it('should anulate an order if pending', async () => {
      const order = await service.createOrder(jwtPayload);

      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          status: 'PENDING_PAYMENT',
          statusUpdatedAt: new Date(),
        },
      });

      const result = await service.anulateOrder(jwtPayload, order.id);
      expect(result).toBeDefined();

      const status = await prisma.orderHeaderStatusHistory.findMany({
        where: { orderHeaderId: order.id },
      });

      expect(status.some((s) => s.status === 'ANULATED')).toBe(true);
    });
  });

  describe('getOrderById', () => {
    it('should return order by id if user is owner', async () => {
      const order = await service.createOrder(jwtPayload);
      const result = await service.getOrderById(jwtPayload, order.id);
      expect(result.id).toBe(order.id);
    });

    it('should throw Forbidden if user is not the owner', async () => {
      const order = await service.createOrder(jwtPayload);

      const otherUserPayload = {
        ...jwtPayload,
        customerId: 'other-customer-id',
        userType: 'CUSTOMER',
      };

      await expect(
        service.getOrderById(otherUserPayload, order.id),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFound if order does not exist', async () => {
      await expect(service.getOrderById(jwtPayload, 'fake-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
