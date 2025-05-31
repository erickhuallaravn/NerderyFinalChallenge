import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateOrderHeaderStatusInput } from './create-order-header-status.input';

@InputType()
export class UpdateOrderHeaderStatusInput extends PartialType(
  CreateOrderHeaderStatusInput,
) {
  @Field()
  id: string;
}
