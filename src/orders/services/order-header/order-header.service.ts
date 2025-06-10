import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderHeaderInput } from '../../dtos/requests/order-header/update-order-header.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { OrderHeaderStatus, RowStatus, UserType } from '@prisma/client';

@Injectable()
export class OrderHeaderService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(authPayload: JwtPayload) {
    return this.prisma.orderHeader.findMany({
      where: {
        customerId: authPayload.customerId!,
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

  async getMyOrders(authPayload: JwtPayload) {
    return this.prisma.orderHeader.findMany({
      where: {
        customerId: authPayload.customerId!,
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

  async getOrderById(authPayload: JwtPayload, orderId: string) {
    const order = await this.prisma.orderHeader.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        orderItems: true,
        statusHistory: true,
      },
    });

    if (
      authPayload.userType !== UserType.MANAGER &&
      order.customerId !== authPayload.customerId
    )
      throw new ForbiddenException('Access denied to this order');

    return order;
  }

  async createOrder(authPayload: JwtPayload, notes?: string) {
    const cart = await this.prisma.shopCartHeader.findFirstOrThrow({
      where: { customerId: authPayload.customerId! },
      include: { cartItems: { include: { itemDiscounts: true } } },
    });

    if (cart.cartItems.length === 0) {
      throw new BadRequestException('Shopping cart is empty');
    }
    const order = await this.prisma.orderHeader.create({
      data: {
        customerId: authPayload.customerId!,
        total: cart.total,
        currencyCode: cart.currencyCode,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productName: item.productName,
            productVariationId: item.productVariationId,
            quantity: item.quantity,
            subtotal: item.subtotal,
            currencyCode: item.currencyCode,
            itemDiscounts: {
              create: item.itemDiscounts.map((discount) => ({
                promotionalDiscountId: discount.promotionalDiscountId,
                requiredAmount: discount.requiredAmount,
                discountPercentage: discount.discountPercentage,
                bonusQuantity: discount.bonusQuantity,
                status: RowStatus.ACTIVE,
                statusUpdatedAt: new Date(),
              })),
            },
            status: RowStatus.ACTIVE,
            statusUpdatedAt: new Date(),
          })),
        },
        statusHistory: {
          create: {
            notes,
            status: OrderHeaderStatus.CREATED,
            statusUpdatedAt: new Date(),
          },
        },
      },
    });

    await this.prisma.shopCartHeader.deleteMany({
      where: {
        customerId: authPayload.customerId!,
      },
    });

    return order;
  }

  async updateOrder(
    authPayload: JwtPayload,
    orderId: string,
    input: UpdateOrderHeaderInput,
  ) {
    const order = await this.prisma.orderHeader.findUniqueOrThrow({
      where: { id: orderId },
    });

    if (
      authPayload.userType !== UserType.MANAGER &&
      order.customerId !== authPayload.customerId
    )
      throw new ForbiddenException('Access denied to this order');

    const latestStatus =
      await this.prisma.orderHeaderStatusHistory.findFirstOrThrow({
        where: { orderHeaderId: orderId },
        orderBy: { createdAt: 'desc' },
      });

    if (
      authPayload.userType !== UserType.CUSTOMER &&
      latestStatus?.status !== OrderHeaderStatus.PENDING_PAYMENT
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

    return this.getOrderById(authPayload, orderId);
  }

  async anulateOrder(authPayload: JwtPayload, orderId: string) {
    const order = await this.prisma.orderHeader.findUniqueOrThrow({
      where: { id: orderId },
    });

    if (
      authPayload.userType !== UserType.MANAGER &&
      order.customerId !== authPayload.customerId
    )
      throw new ForbiddenException('Access denied to this order');

    const latestStatus =
      await this.prisma.orderHeaderStatusHistory.findFirstOrThrow({
        where: { orderHeaderId: orderId },
        orderBy: { createdAt: 'desc' },
      });

    if (
      authPayload.userType !== UserType.MANAGER &&
      latestStatus?.status !== OrderHeaderStatus.PENDING_PAYMENT
    ) {
      throw new BadRequestException('Only pending orders can be anulated');
    }

    return this.prisma.orderHeader.update({
      where: { id: orderId },
      data: {
        orderItems: {
          updateMany: { where: {}, data: { status: RowStatus.DELETED } },
        },
        statusHistory: {
          updateMany: {
            where: {},
            data: { status: OrderHeaderStatus.ANULATED },
          },
        },
      },
    });
  }
}
