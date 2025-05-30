import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ShopCartItemDiscount {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  requiredAmount: number;

  @Field({ nullable: true })
  discountPercentage?: number;

  @Field({ nullable: true })
  bonusQuantity?: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
