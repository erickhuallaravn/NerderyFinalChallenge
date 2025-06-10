import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class AddVariationFeatureInput {
  @Field()
  @IsString()
  optionCode: string;

  @Field()
  @IsString()
  valueCode: string;

  @Field()
  @IsUUID()
  productVariationId: string;
}
