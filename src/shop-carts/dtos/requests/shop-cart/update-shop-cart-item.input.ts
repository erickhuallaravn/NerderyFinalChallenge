import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateShopCartItemInput {
  @Field(() => String)
  cartItemId: string;

  @Field(() => Int)
  quantity: number;
}
