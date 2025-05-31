import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateOrderHeaderInput {
  @Field()
  @IsUUID()
  customerId: string;

  @Field()
  @IsNumber()
  subtotal: number;

  @Field(() => String, { nullable: true })
  @IsString()
  notes?: string;
}
