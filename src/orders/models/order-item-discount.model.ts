import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Customer } from '../../customer/customer.model';

@ObjectType()
export class OrderItemDiscount {
  @Field(() => ID)
  id: string;

  @Field()
  orderDetailId: string;

  @Field()
  promotionalDiscountId: string;

  @Field(() => String)
  productName: string;

  @Field(() => Int)
  requiredAmount: number;

  @Field()
  discountPercentage: number;

  @Field(() => Int)
  bonusQuantity?: number;

  @Field(() => Customer)
  customer: Customer;
}
