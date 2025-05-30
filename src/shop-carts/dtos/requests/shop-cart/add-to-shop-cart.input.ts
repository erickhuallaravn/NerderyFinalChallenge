import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AddToShopCartInput {
  @Field(() => String)
  productVariationId: string;

  @Field(() => Int)
  quantity: number;
}
