import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import { ProductStatus, CurrencyCode } from 'src/shared/enums';
import { UpdateVariationFeatureInput } from '../variation/update-variation-feature.input';

@InputType()
export class UpdateProductVariationInput {
  @Field(() => ID)
  productVariationId: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  currencyCode?: CurrencyCode;

  @Field(() => Int, { nullable: true })
  availableStock?: number;

  @Field(() => [UpdateVariationFeatureInput], { nullable: true })
  features?: [UpdateVariationFeatureInput];

  @Field({ nullable: true })
  status?: ProductStatus;
}
