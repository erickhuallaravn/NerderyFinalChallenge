import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateOrderHeaderStatusInput {
  @Field()
  @IsUUID()
  orderHeaderId: string;

  @Field()
  @IsUUID()
  orderStatusId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
