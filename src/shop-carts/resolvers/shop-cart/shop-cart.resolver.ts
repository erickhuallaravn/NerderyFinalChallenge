import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShopCartService } from '../../services/shop-cart/shop-cart.service';
import { ShopCartItem as ShopCartItemEntity } from 'generated/prisma';
import { AddToShopCartInput } from '../../dtos/requests/shop-cart/add-to-shop-cart.input';
import { ShopCartItem } from '../../models/shop-cart/shop-cart-item.model';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => ShopCartResolver)
@UseGuards(GqlAuthGuard)
export class ShopCartResolver {
  constructor(private readonly shopCartService: ShopCartService) {}

  @Query(() => [ShopCartItem])
  async getCartItems(
    @CurrentUser() user: JwtPayload,
  ): Promise<ShopCartItemEntity[]> {
    return this.shopCartService.getItems(user.customerId);
  }

  @Mutation(() => Boolean)
  async addOrUpdateCartItem(
    @CurrentUser() user: JwtPayload,
    @Args('input') input: AddToShopCartInput,
  ): Promise<boolean> {
    return this.shopCartService.addOrUpdateItem(user.customerId, input);
  }

  @Mutation(() => Boolean)
  async emptyCart(@CurrentUser() user: JwtPayload): Promise<boolean> {
    return this.shopCartService.emptyCart(user.customerId);
  }
}
