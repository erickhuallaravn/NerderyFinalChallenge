import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { ShopCartItemDiscount } from '../shop-cart-item-discount/shop-cart-item-discount';

@ObjectType()
export class ShopCartItem {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  productVariationId: string;

  @Field(() => String)
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  subtotal: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => [ShopCartItemDiscount])
  shopCartItemDiscounts: ShopCartItemDiscount[];
}
