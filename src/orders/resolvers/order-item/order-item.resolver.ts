import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { OrderItemService } from '../../services/order-item/order-item.service';
import { OrderItem } from '../../models/order-item.model';
import { UpdateOrderItemInput } from '../../dtos/requests/order-item/update-order-item.input';

import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Resolver(() => OrderItem)
@UseGuards(GqlAuthGuard)
export class OrderItemResolver {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderItem)
  async getItemsByOrder(
    @CurrentUser() authPayload: JwtPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.orderItemService.getItemsByOrderId(authPayload, itemId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderItem)
  async getOrderItem(
    @CurrentUser() authPayload: JwtPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.orderItemService.getItemById(authPayload, itemId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderItem)
  async updateOrderItem(
    @CurrentUser() authPayload: JwtPayload,
    @Args('itemId') itemId: string,
    @Args('input') input: UpdateOrderItemInput,
  ) {
    return await this.orderItemService.createOrUpdateItem(
      authPayload,
      itemId,
      input,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderItem)
  async deleteOrderItem(
    @CurrentUser() authPayload: JwtPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.orderItemService.deleteItem(authPayload, itemId);
  }
}
