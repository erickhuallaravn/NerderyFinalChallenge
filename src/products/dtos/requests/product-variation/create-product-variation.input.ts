import { Field, InputType, ID } from '@nestjs/graphql';
import { CurrencyCode } from 'src/shared/enums';
import { UpdateVariationFeatureInput } from '../variation/update-variation-feature.input';

@InputType()
export class CreateProductVariationInput {
  @Field(() => ID)
  productId: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  currencyCode: CurrencyCode;

  @Field()
  availableStock: number;

  @Field(() => [UpdateVariationFeatureInput])
  features?: [UpdateVariationFeatureInput];
}
