import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateOrderItemDiscountInput {
  @Field()
  @IsUUID()
  orderDetailId: string;

  @Field()
  @IsUUID()
  promotionalDiscountId: string;

  @Field()
  @IsNumber()
  requiredAmount: number;

  @Field({ nullable: true })
  @IsOptional()
  discountPercentage?: number;

  @Field({ nullable: true })
  @IsOptional()
  bonusQuantity?: number;
}
