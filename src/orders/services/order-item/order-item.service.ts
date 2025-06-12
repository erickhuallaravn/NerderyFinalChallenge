import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { UpdateOrderItemInput } from '../../dtos/requests/order-item/update-order-item.input';
import { OrderHeaderStatus, RowStatus, UserType } from '@prisma/client';

@Injectable()
export class OrderItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getItemsByOrderId(authPayload: JwtPayload, orderId: string) {
    const order = await this.prisma.orderHeader.findUniqueOrThrow({
      where: { id: orderId },
    });

    if (
      authPayload.userType !== 'MANAGER' &&
      order.customerId !== authPayload.customerId
    )
      throw new ForbiddenException('Access denied to this order');

    return this.prisma.orderItem.findMany({
      where: { orderHeaderId: orderId },
      include: { itemDiscounts: true },
    });
  }

  async getItemById(authPayload: JwtPayload, itemId: string) {
    const item = await this.prisma.orderItem.findUniqueOrThrow({
      where: { id: itemId },
      include: {
        orderHeader: true,
        itemDiscounts: true,
      },
    });

    if (
      authPayload.userType !== UserType.MANAGER &&
      item.orderHeader.customerId !== authPayload.customerId
    ) {
      throw new ForbiddenException('Access denied to this order item');
    }

    return item;
  }

  async createOrUpdateItem(
    user: JwtPayload,
    itemId: string,
    input: UpdateOrderItemInput,
  ) {
    const item = await this.prisma.orderItem.findUniqueOrThrow({
      where: { id: itemId },
      include: { orderHeader: true },
    });

    if (
      user.userType !== UserType.MANAGER &&
      item.orderHeader.customerId !== user.customerId
    ) {
      throw new ForbiddenException('Access denied to this item');
    }

    const latestStatus =
      await this.prisma.orderHeaderStatusHistory.findFirstOrThrow({
        where: { orderHeaderId: item.orderHeaderId },
        orderBy: { createdAt: 'desc' },
      });

    if (latestStatus?.status !== OrderHeaderStatus.PENDING_PAYMENT) {
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

  async deleteItem(authPayload: JwtPayload, itemId: string) {
    const item = await this.prisma.orderItem.findUniqueOrThrow({
      where: { id: itemId },
      include: { orderHeader: true },
    });

    if (
      authPayload.userType !== UserType.MANAGER &&
      item.orderHeader.customerId !== authPayload.customerId
    ) {
      throw new ForbiddenException('Access denied to this item');
    }

    const latestStatus =
      await this.prisma.orderHeaderStatusHistory.findFirstOrThrow({
        where: { orderHeaderId: item.orderHeaderId },
        orderBy: { createdAt: 'desc' },
      });

    if (
      authPayload.userType !== UserType.MANAGER &&
      latestStatus?.status !== OrderHeaderStatus.PENDING_PAYMENT
    ) {
      throw new BadRequestException(
        'Cannot delete items unless order is pending',
      );
    }

    return this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status: RowStatus.DELETED,
        statusUpdatedAt: new Date(),
      },
    });
  }
}
