import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { OrderItemService } from '../../services/order-item/order-item.service';
import { OrderItem } from '../../models/order-item.model';
import { UpdateOrderItemInput } from '../../dtos/requests/order-item/update-order-item.input';

@Resolver(() => OrderItem)
@UseGuards(GqlAuthGuard)
export class OrderItemResolver {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderItem)
  async getItemsByOrder(
    @CurrentUser() user: JwtPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.orderItemService.getItemsByOrderId(user, itemId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderItem)
  async getOrderItem(
    @CurrentUser() user: JwtPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.orderItemService.getItemById(user, itemId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderItem)
  async updateOrderItem(
    @CurrentUser() user: JwtPayload,
    @Args('itemId') itemId: string,
    @Args('input') input: UpdateOrderItemInput,
  ) {
    return this.orderItemService.updateItem(user, itemId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderItem)
  async deleteOrderItem(
    @CurrentUser() user: JwtPayload,
    @Args('itemId') itemId: string,
  ) {
    return this.orderItemService.deleteItem(user, itemId);
  }
}
