import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateOrderHeaderStatusInput } from './create-order-header-status.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateOrderHeaderStatusInput extends PartialType(
  CreateOrderHeaderStatusInput,
) {
  @Field()
  @IsUUID()
  id: string;
}
