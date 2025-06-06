import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderHeaderInput } from '../../dtos/requests/order-header/update-order-header.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Prisma } from 'generated/prisma';

const orderInclude = {
  orderItems: true,
  statusHistory: true,
};

@Injectable()
export class OrderHeaderService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(user: JwtPayload) {
    return this.prisma.orderHeader.findMany({
      where: {
        customerId: user.customerId,
      },
      include: {
        orderItems: {
          include: {
            itemDiscounts: true,
          },
        },
        statusHistory: true,
      },
    });
  }

  async getOrderById(user: JwtPayload, orderId: string) {
    const order = await this.prisma.orderHeader.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        statusHistory: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.userType !== 'MANAGER' && order.customerId !== user.customerId)
      throw new ForbiddenException('Access denied to this order');

    return order;
  }

  async createOrder(user: JwtPayload, notes?: string): Promise<Prisma.OrderHeaderGetPayload<{ include: typeof orderInclude }>> {
    const cart = await this.prisma.shopCartHeader.findFirst({
      where: { customerId: user.customerId },
      include: { cartItems: { include: { itemDiscounts: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Shopping cart is empty');
    }

    const subtotal = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );
    const order = await this.prisma.orderHeader.create({
      data: {
        customerId: user.customerId,
        subtotal,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productName: item.productName,
            productVariationId: item.productVariationId,
            quantity: item.quantity,
            subtotal: item.subtotal,
            itemDiscounts: {
              create: item.itemDiscounts.map((discount) => ({
                promotionalDiscountId: discount.promotionalDiscountId,
                requiredAmount: discount.requiredAmount,
                discountPercentage: discount.discountPercentage,
                bonusQuantity: discount.bonusQuantity,
                status: 'ACTIVE',
                statusUpdatedAt: new Date(),
              })),
            },
            status: 'ACTIVE',
            statusUpdatedAt: new Date(),
          })),
        },
        statusHistory: {
          create: {
            notes,
            status: 'CREATED',
            statusUpdatedAt: new Date(),
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Optionally clear the shopping cart here

    return order;
  }

  async updateOrder(
    user: JwtPayload,
    orderId: string,
    input: UpdateOrderHeaderInput,
  ) {
    const order = await this.prisma.orderHeader.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.userType !== 'MANAGER' && order.customerId !== user.customerId)
      throw new ForbiddenException('Access denied to this order');

    const latestStatus = await this.prisma.orderHeaderStatusHistory.findFirst({
      where: { orderHeaderId: orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (
      user.userType !== 'CUSTOMER' &&
      latestStatus?.status !== 'PENDING_PAYMENT'
    ) {
      throw new BadRequestException('Order can only be updated if pending');
    }

    await this.prisma.orderHeaderStatusHistory.create({
      data: {
        orderHeaderId: orderId,
        notes: input.notes,
        status: input.status,
        statusUpdatedAt: new Date(),
      },
    });

    return this.getOrderById(user, orderId);
  }

  async anulateOrder(user: JwtPayload, orderId: string) {
    const order = await this.prisma.orderHeader.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.userType !== 'MANAGER' && order.customerId !== user.customerId)
      throw new ForbiddenException('Access denied to this order');

    const latestStatus = await this.prisma.orderHeaderStatusHistory.findFirst({
      where: { orderHeaderId: orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (
      user.userType !== 'MANAGER' &&
      latestStatus?.status !== 'PENDING_PAYMENT'
    ) {
      throw new BadRequestException('Only pending orders can be anulated');
    }

    return this.prisma.orderHeader.update({
      where: { id: orderId },
      data: {
        orderItems: {
          updateMany: { where: {}, data: { status: 'DELETED' } },
        },
        statusHistory: {
          updateMany: { where: {}, data: { status: 'ANULATED' } },
        },
      },
    });
  }
}
