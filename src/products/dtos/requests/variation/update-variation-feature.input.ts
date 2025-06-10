import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateVariationFeatureInput {
  @Field()
  @IsString()
  optionCode: string;

  @Field()
  @IsString()
  valueCode: string;
}
