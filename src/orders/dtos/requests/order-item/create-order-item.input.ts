import { InputType, Field } from '@nestjs/graphql';
import { CreateOrderItemDiscountInput } from '../order-item-discount/create-order-item-discount.input';
import {
  IsUUID,
  IsNumber,
  IsString,
  IsDecimal,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @Field()
  @IsUUID()
  orderHeaderId: string;

  @Field()
  @IsUUID()
  productVariationId: string;

  @Field()
  @IsNumber()
  quantity: number;

  @Field()
  @IsDecimal()
  subtotal: number;

  @Field()
  @IsString()
  productName: string;

  @Field(() => [CreateOrderItemDiscountInput], { nullable: true })
  @IsOptional()
  itemDiscounts?: CreateOrderItemDiscountInput[];
}
