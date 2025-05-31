import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Customer } from '../../customer/customer.model';
import { OrderItem } from './order-item.model';
import { OrderHeaderStatusHistory } from './order-header-status-history.model';

@ObjectType()
export class OrderHeader {
  @Field(() => ID)
  id: string;

  @Field(() => Customer)
  customer: Customer;

  @Field()
  subtotal: number;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field(() => [OrderHeaderStatusHistory])
  statusHistory: OrderHeaderStatusHistory[];

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
