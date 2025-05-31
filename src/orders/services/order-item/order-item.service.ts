import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { CreateOrderItemInput } from '../../dtos/requests/order-item/create-order-item.input';
import { UpdateOrderItemInput } from '../../dtos/requests/order-item/update-order-item.input';

@Injectable()
export class OrderItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getItemsByOrderId(user: JwtPayload, orderId: string) {
    const order = await this.prisma.orderHeader.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.userType !== 'MANAGER' && order.customerId !== user.customerId)
      throw new ForbiddenException('Access denied to this order');

    return this.prisma.orderItem.findMany({
      where: { orderHeaderId: orderId },
      include: { itemDiscounts: true },
    });
  }

  async getItemById(user: JwtPayload, itemId: string) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        orderHeader: true,
        itemDiscounts: true,
      },
    });

    if (!item) throw new NotFoundException('Order item not found');

    if (
      user.userType !== 'MANAGER' &&
      item.orderHeader.customerId !== user.customerId
    ) {
      throw new ForbiddenException('Access denied to this order item');
    }

    return item;
  }

  async createItem(
    user: JwtPayload,
    orderId: string,
    input: CreateOrderItemInput,
  ) {
    const order = await this.prisma.orderHeader.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.userType !== 'MANAGER' && order.customerId !== user.customerId) {
      throw new ForbiddenException('Access denied to this order');
    }

    const latestStatus = await this.prisma.orderHeaderStatusHistory.findFirst({
      where: { orderHeaderId: orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (
      user.userType !== 'MANAGER' &&
      latestStatus?.status !== 'PENDING_PAYMENT'
    ) {
      throw new BadRequestException('Cannot add items unless order is pending');
    }
    return this.prisma.orderItem.create({
      data: {
        orderHeaderId: orderId,
        productName: input.productName,
        productVariationId: input.productVariationId,
        quantity: input.quantity,
        subtotal: input.subtotal,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
        itemDiscounts: {
          create: input.itemDiscounts?.map((d) => ({
            promotionalDiscountId: d.promotionalDiscountId,
            requiredAmount: d.requiredAmount,
            discountPercentage: d.discountPercentage,
            bonusQuantity: d.bonusQuantity,
            status: 'ACTIVE',
            statusUpdatedAt: new Date(),
          })),
        },
      },
      include: { itemDiscounts: true },
    });
  }

  async updateItem(
    user: JwtPayload,
    itemId: string,
    input: UpdateOrderItemInput,
  ) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: { orderHeader: true },
    });

    if (!item) throw new NotFoundException('Order item not found');

    if (
      user.userType !== 'MANAGER' &&
      item.orderHeader.customerId !== user.customerId
    ) {
      throw new ForbiddenException('Access denied to this item');
    }

    const latestStatus = await this.prisma.orderHeaderStatusHistory.findFirst({
      where: { orderHeaderId: item.orderHeaderId },
      orderBy: { createdAt: 'desc' },
    });

    if (
      user.userType !== 'MANAGER' &&
      latestStatus?.status !== 'PENDING_PAYMENT'
    ) {
      throw new BadRequestException(
        'Cannot update items unless order is pending',
      );
    }

    return this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        productName: input.productName,
        productVariationId: input.productVariationId,
        quantity: input.quantity,
        subtotal: input.subtotal,
        statusUpdatedAt: new Date(),
      },
    });
  }

  async deleteItem(user: JwtPayload, itemId: string) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: { orderHeader: true },
    });

    if (!item) throw new NotFoundException('Order item not found');

    if (
      user.userType !== 'MANAGER' &&
      item.orderHeader.customerId !== user.customerId
    ) {
      throw new ForbiddenException('Access denied to this item');
    }

    const latestStatus = await this.prisma.orderHeaderStatusHistory.findFirst({
      where: { orderHeaderId: item.orderHeaderId },
      orderBy: { createdAt: 'desc' },
    });

    if (
      user.userType !== 'MANAGER' &&
      latestStatus?.status !== 'PENDING_PAYMENT'
    ) {
      throw new BadRequestException(
        'Cannot delete items unless order is pending',
      );
    }

    return this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status: 'DELETED',
        statusUpdatedAt: new Date(),
      },
    });
  }
}
