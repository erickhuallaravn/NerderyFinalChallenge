import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class AddToShopCartInput {
  @Field(() => String)
  @IsUUID()
  productVariationId: string;

  @Field(() => Int)
  @IsNumber()
  quantity: number;
}
