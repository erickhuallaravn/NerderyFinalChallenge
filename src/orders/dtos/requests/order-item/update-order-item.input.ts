import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateOrderItemInput } from './create-order-item.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateOrderItemInput extends PartialType(CreateOrderItemInput) {
  @Field()
  @IsUUID()
  id: string;
}
