import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateOrderItemInput } from 'src/orders/dtos/requests/order-item/create-order-item.input';
import { UpdateOrderItemInput } from 'src/orders/dtos/requests/order-item/update-order-item.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { RolePermission, UserType } from 'generated/prisma';
import { OrderModule } from 'src/orders/orders.module';
import { AuthModule } from 'src/auth/auth.module';
import { v4 as uuidv4 } from 'uuid';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtPayload: JwtPayload;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, AuthModule],
      providers: [PrismaService],
    }).compile();

    service = module.get(OrderItemService);
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

  const createOrderWithVariation = async () => {
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
        subtotal: 0,
        statusHistory: {
          create: {
            status: 'PENDING_PAYMENT',
            statusUpdatedAt: new Date(),
          },
        },
      },
    });

    return { variation, order };
  };

  const createOrderWithItem = async () => {
    const { variation, order } = await createOrderWithVariation();

    const now = new Date();

    const item = await prisma.orderItem.create({
      data: {
        orderHeaderId: order.id,
        productName: variation.name,
        productVariationId: variation.id,
        quantity: 2,
        subtotal: 300,
        createdAt: now,
        status: 'ACTIVE',
        statusUpdatedAt: now,
      },
    });

    return { orderItem: item, orderId: order.id };
  };

  describe('getItemById', () => {
    it('should return order item if user is owner', async () => {
      const { orderItem } = await createOrderWithItem();
      const result = await service.getItemById(jwtPayload, orderItem.id);
      expect(result.id).toBe(orderItem.id);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const { orderItem } = await createOrderWithItem();
      const otherUser = {
        ...jwtPayload,
        customerId: uuidv4(),
        userType: 'CUSTOMER' as UserType,
      };
      await expect(
        service.getItemById(otherUser, orderItem.id),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      await expect(service.getItemById(jwtPayload, uuidv4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getItemsByOrderId', () => {
    it('should return items belonging to user', async () => {
      const { orderId } = await createOrderWithItem();
      const result = await service.getItemsByOrderId(jwtPayload, orderId);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should allow MANAGER to access any order', async () => {
      const { orderId } = await createOrderWithItem();
      const manager = { ...jwtPayload, userType: 'MANAGER' as UserType };
      const result = await service.getItemsByOrderId(manager, orderId);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw NotFoundException for invalid order', async () => {
      await expect(
        service.getItemsByOrderId(jwtPayload, uuidv4()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const { orderId } = await createOrderWithItem();
      const other = { ...jwtPayload, customerId: uuidv4() };
      await expect(service.getItemsByOrderId(other, orderId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('createItem', () => {
    it('should create item for order in PENDING_PAYMENT', async () => {
      const { variation, order } = await createOrderWithVariation();

      const input: CreateOrderItemInput = {
        orderHeaderId: order.id,
        productName: variation.name,
        productVariationId: variation.id,
        quantity: 2,
        subtotal: 300,
        itemDiscounts: [],
      };

      const result = await service.createItem(jwtPayload, order.id, input);
      expect(result).toHaveProperty('id');
      expect(result.productName).toBe(input.productName);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const { variation, order } = await createOrderWithVariation();
      const other = { ...jwtPayload, customerId: uuidv4() };

      const input: CreateOrderItemInput = {
        orderHeaderId: order.id,
        productName: variation.name,
        productVariationId: variation.id,
        quantity: 1,
        subtotal: 100,
        itemDiscounts: [],
      };

      await expect(service.createItem(other, order.id, input)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateItem', () => {
    it('should update item if user is owner and order is PENDING_PAYMENT', async () => {
      const { orderItem } = await createOrderWithItem();
      const input: UpdateOrderItemInput = {
        productName: 'Updated',
        productVariationId: orderItem.productVariationId,
        quantity: 3,
        subtotal: 450,
      };

      const result = await service.updateItem(jwtPayload, orderItem.id, input);
      expect(result.quantity).toBe(3);
      expect(Number(result.subtotal)).toBe(450);
      expect(result.productName).toBe('Updated');
    });

    it('should throw if item does not exist', async () => {
      const input: UpdateOrderItemInput = {
        productName: 'X',
        productVariationId: uuidv4(),
        quantity: 1,
        subtotal: 10,
      };

      await expect(
        service.updateItem(jwtPayload, uuidv4(), input),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteItem', () => {
    it('should mark item as DELETED', async () => {
      const { orderItem } = await createOrderWithItem();
      const result = await service.deleteItem(jwtPayload, orderItem.id);
      expect(result.status).toBe('DELETED');
    });

    it('should throw if item not found', async () => {
      await expect(service.deleteItem(jwtPayload, uuidv4())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException for unauthorized user', async () => {
      const { orderItem } = await createOrderWithItem();
      const other = { ...jwtPayload, customerId: uuidv4() };

      await expect(service.deleteItem(other, orderItem.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
