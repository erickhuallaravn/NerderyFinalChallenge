import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsNumber, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateOrderHeaderInput {
  @Field()
  @IsUUID()
  customerId: string;

  @Field()
  @IsNumber()
  subtotal: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
