import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteVariationFeatureInput {
  @Field()
  @IsUUID()
  optionValueId: string;

  @Field()
  @IsUUID()
  productVariationId: string;
}
