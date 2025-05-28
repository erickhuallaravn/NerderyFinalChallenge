import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OptionValue } from '../option/option-value.model';
import { ProductVariation } from '../product-variation/product-variation.model';

@ObjectType()
export class Feature {
  @Field(() => ID)
  id: string;

  @Field()
  optionValueId: string;

  @Field()
  productVariationId: string;

  @Field(() => OptionValue)
  optionValue: OptionValue;

  @Field(() => ProductVariation)
  productVariation: ProductVariation;
}
