/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderHeader as OrderHeaderEntity } from '@prisma/client';

import { OrderHeaderService } from '../../services/order-header/order-header.service';
import { OrderHeader } from '../../models/order-header.model';
import { UpdateOrderHeaderInput } from '../../dtos/requests/order-header/update-order-header.input';

import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  ValidCustomerPayload,
  ValidManagerPayload,
} from 'src/auth/decorators/valid-auth-payload.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Resolver(() => OrderHeader)
export class OrderHeaderResolver {
  constructor(private readonly orderHeaderService: OrderHeaderService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [OrderHeader])
  async getOrders(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
  ): Promise<OrderHeaderEntity[]> {
    return this.orderHeaderService.getOrders();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [OrderHeader])
  async getMyOrders(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
  ): Promise<OrderHeaderEntity[]> {
    return this.orderHeaderService.getMyOrders(authPayload);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderHeader)
  async createOrder(
    @CurrentUser() @ValidCustomerPayload() user: JwtPayload,
    @Args('notes', { nullable: true }) notes?: string,
  ): Promise<OrderHeaderEntity> {
    return this.orderHeaderService.createOrder(user, notes);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderHeader)
  async updateOrder(
    @CurrentUser() user: JwtPayload,
    @Args('orderId') orderId: string,
    @Args('input') input: UpdateOrderHeaderInput,
  ): Promise<OrderHeaderEntity> {
    return this.orderHeaderService.updateOrder(user, orderId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderHeader)
  async anulateOrder(
    @CurrentUser() user: JwtPayload,
    @Args('orderId') orderId: string,
  ): Promise<OrderHeaderEntity> {
    return this.orderHeaderService.anulateOrder(user, orderId);
  }
}
