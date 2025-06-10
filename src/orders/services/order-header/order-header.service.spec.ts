import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderHeaderService } from './order-header.service';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderHeaderInput } from '../../dtos/requests/order-header/update-order-header.input';
import { RolePermission, UserType } from '@prisma/client';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { OrderModule } from 'src/orders/orders.module';
import { AuthModule } from 'src/auth/auth.module';
import { v4 as uuidv4 } from 'uuid';

describe('OrderHeaderService (DB-based)', () => {
  let service: OrderHeaderService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtPayload: JwtPayload;
  let customerId: string;

  const createTestProductVariation = async () =>
    prisma.productVariation.create({
      data: {
        name: 'Test Var',
        product: {
          create: {
            name: 'Product',
            description: 'Desc',
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

  const setupCartWithProduct = async () => {
    const variation = await createTestProductVariation();

    // ✅ asegúrate de que el customerId existe antes de crear
    const customerExists = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customerExists) {
      throw new Error(`Customer ID ${customerId} not found`);
    }

    await prisma.shopCartHeader.create({
      data: {
        customerId,
        cartItems: {
          create: [
            {
              productVariationId: variation.id,
              productName: variation.name,
              quantity: 1,
              subtotal: variation.price,
              itemDiscounts: {},
            },
          ],
        },
      },
    });

    return variation;
  };

  const managerPayload = () => ({
    ...jwtPayload,
    userType: 'MANAGER' as UserType,
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, AuthModule],
      providers: [PrismaService],
    }).compile();

    service = module.get(OrderHeaderService);
    prisma = module.get(PrismaService);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();

    await prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER',
        description: 'Standard role',
        permissions: [
          RolePermission.READ,
          RolePermission.WRITE,
          RolePermission.UPDATE,
          RolePermission.DELETE,
        ],
      },
    });

    const token = await authService.registerCustomer({
      email: 'orderheader@email.com',
      password: '123456',
      firstName: 'OrderItem',
      lastName: 'User',
    });

    jwtPayload = await jwtService.verifyAsync(token);

    // ❗ asegurarse de que el customer esté en la base de datos
    const customer = await prisma.customer.findUnique({
      where: { id: jwtPayload.customerId },
    });

    if (!customer) {
      throw new Error('Customer not found after registration');
    }

    customerId = customer.id;

    await setupCartWithProduct();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createOrder()', () => {
    it('should throw BadRequestException if cart is empty', async () => {
      await prisma.shopCartHeader.deleteMany();
      await expect(service.createOrder(jwtPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create order with items and discounts', async () => {
      const order = await service.createOrder(jwtPayload, 'First order');
      expect(order).toBeDefined();
      expect(order.orderItems.length).toBeGreaterThan(0);
      expect(order.statusHistory[0].status).toBe('CREATED');
    });
  });

  describe('getOrders()', () => {
    it('should return customer orders', async () => {
      await service.createOrder(jwtPayload);
      const orders = await service.getOrders(jwtPayload);
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
    });
  });

  describe('getOrderById()', () => {
    it('should return an order owned by customer', async () => {
      const order = await service.createOrder(jwtPayload);
      const result = await service.getOrderById(jwtPayload, order.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(order.id);
    });

    it('should throw ForbiddenException if not owner', async () => {
      const order = await service.createOrder(jwtPayload);
      const otherPayload = {
        ...jwtPayload,
        customerId: uuidv4(),
      };
      await expect(
        service.getOrderById(otherPayload, order.id),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      await expect(service.getOrderById(jwtPayload, uuidv4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOrder()', () => {
    it('should update an order status if pending and manager', async () => {
      const baseDate = new Date();

      const order = await service.createOrder(jwtPayload);
      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          status: 'PENDING_PAYMENT',
          statusUpdatedAt: new Date(baseDate.getTime() + 100000), // +100 segundos,
          createdAt: new Date(baseDate.getTime() + 100000), // +100 segundos,
        },
      });

      const input: UpdateOrderHeaderInput = {
        status: 'PENDING_PAYMENT',
        notes: 'Manager updated',
      };

      const updated = await service.updateOrder(
        managerPayload(),
        order.id,
        input,
      );
      expect(updated.statusHistory.at(-1)?.status).toBe('PENDING_PAYMENT');
    });

    it('should throw BadRequestException if not in PENDING_PAYMENT', async () => {
      const baseDate = new Date();

      const order = await service.createOrder(jwtPayload);
      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          createdAt: new Date(baseDate.getTime() + 100000), // +100 segundos
          status: 'SHIPPED',
          statusUpdatedAt: new Date(baseDate.getTime() + 100000), // +100 segundos,
        },
      });

      const input: UpdateOrderHeaderInput = {
        status: 'PENDING_PAYMENT',
        notes: 'Should fail',
      };

      await expect(
        service.updateOrder(managerPayload(), order.id, input),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('anulateOrder()', () => {
    it('should anulate an order if pending and manager', async () => {
      const baseDate = new Date();

      const order = await service.createOrder(jwtPayload);
      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          createdAt: new Date(baseDate.getTime() + 100000), // +100 segundos
          status: 'PENDING_PAYMENT',
          statusUpdatedAt: new Date(baseDate.getTime() + 100000), // +100 segundos
        },
      });

      const result = await service.anulateOrder(managerPayload(), order.id);
      expect(result.statusHistory.at(-1)?.status).toBe('ANULATED');
    });

    it('should throw BadRequestException if not in PENDING_PAYMENT', async () => {
      const baseDate = new Date();

      const order = await service.createOrder(jwtPayload);

      await prisma.orderHeaderStatusHistory.create({
        data: {
          orderHeaderId: order.id,
          createdAt: new Date(baseDate.getTime() + 100000), // +100 segundos
          status: 'SHIPPED',
          statusUpdatedAt: new Date(baseDate.getTime() + 100000), // +100 segundos
        },
      });

      await expect(
        service.anulateOrder(managerPayload(), order.id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
