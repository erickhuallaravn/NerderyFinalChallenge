import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateVariationFeatureInput {
  @Field()
  optionCode: string;

  @Field()
  valueCode: string;
}
