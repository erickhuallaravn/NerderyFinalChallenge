import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateOrderItemDiscountInput } from './create-order-item-discount.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateOrderItemDiscountInput extends PartialType(
  CreateOrderItemDiscountInput,
) {
  @Field()
  @IsUUID()
  id: string;
}
