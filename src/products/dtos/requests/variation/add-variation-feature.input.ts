import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddVariationFeatureInput {
  @Field()
  optionCode: string;

  @Field()
  valueCode: string;

  @Field()
  productVariationId: string;
}
