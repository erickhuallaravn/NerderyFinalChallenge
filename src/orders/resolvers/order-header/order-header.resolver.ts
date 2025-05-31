import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { OrderHeaderService } from '../../services/order-header/order-header.service';
import { OrderHeader } from '../../models/order-header.model';
import { UpdateOrderHeaderInput } from '../../dtos/requests/order-header/update-order-header.input';

@Resolver(() => OrderHeader)
export class OrderHeaderResolver {
  constructor(private readonly orderHeaderService: OrderHeaderService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [OrderHeader], { name: 'getOrders' })
  async getOrders(@CurrentUser() user: JwtPayload) {
    return this.orderHeaderService.getOrders(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderHeader, { name: 'createOrder' })
  async createOrder(
    @CurrentUser() user: JwtPayload,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.orderHeaderService.createOrder(user, notes);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderHeader, { name: 'updateOrder' })
  async updateOrder(
    @CurrentUser() user: JwtPayload,
    @Args('orderId') orderId: string,
    @Args('input') input: UpdateOrderHeaderInput,
  ) {
    return this.orderHeaderService.updateOrder(user, orderId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderHeader, { name: 'anulateOrder' })
  async anulateOrder(
    @CurrentUser() user: JwtPayload,
    @Args('orderId') orderId: string,
  ) {
    return this.orderHeaderService.anulateOrder(user, orderId);
  }
}
