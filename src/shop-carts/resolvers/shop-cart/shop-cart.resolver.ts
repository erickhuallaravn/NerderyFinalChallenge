import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShopCartService } from '../../services/shop-cart/shop-cart.service';
import { ShopCartItem as ShopCartItemEntity } from '@prisma/client';
import { AddToShopCartInput } from '../../dtos/requests/shop-cart/add-to-shop-cart.input';
import { ShopCartItem } from '../../models/shop-cart/shop-cart-item.model';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ValidCustomerPayload } from 'src/auth/decorators/valid-auth-payload.decorator';

@Resolver(() => ShopCartResolver)
@UseGuards(GqlAuthGuard)
export class ShopCartResolver {
  constructor(private readonly shopCartService: ShopCartService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [ShopCartItem])
  async getMyCartItems(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
  ): Promise<ShopCartItemEntity[]> {
    return this.shopCartService.getItems(authPayload);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async addOrUpdateCartItem(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
    @Args('input') input: AddToShopCartInput,
  ): Promise<boolean> {
    return this.shopCartService.addOrUpdateItem(authPayload, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async emptyCart(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
  ): Promise<boolean> {
    return this.shopCartService.emptyCart(authPayload);
  }
}
