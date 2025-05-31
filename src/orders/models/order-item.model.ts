import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Customer } from '../../customer/customer.model';
import { OrderItemDiscount } from './order-item-discount.model';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  subtotal: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Customer)
  customer: Customer;

  @Field(() => [OrderItemDiscount])
  itemDiscounts: OrderItemDiscount[];
}
