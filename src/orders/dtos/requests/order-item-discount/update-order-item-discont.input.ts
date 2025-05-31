import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateOrderItemDiscountInput } from './create-order-item-discount.input';

@InputType()
export class UpdateOrderItemDiscountInput extends PartialType(
  CreateOrderItemDiscountInput,
) {
  @Field()
  id: string;
}
