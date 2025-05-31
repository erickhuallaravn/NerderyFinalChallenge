import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateOrderHeaderInput } from './create-order-header.input';
import { OrderHeaderStatus } from 'src/shared/enums';

@InputType()
export class UpdateOrderHeaderInput extends PartialType(
  CreateOrderHeaderInput,
) {
  @Field()
  status: OrderHeaderStatus;
}
