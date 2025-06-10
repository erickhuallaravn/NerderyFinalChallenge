import { Field, InputType, ID } from '@nestjs/graphql';
import { CurrencyCode } from 'src/shared/enums';
import { UpdateVariationFeatureInput } from '../variation/update-variation-feature.input';
import { IsDecimal, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateProductVariationInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsDecimal()
  price: number;

  @Field()
  currencyCode: CurrencyCode;

  @Field()
  @IsNumber()
  availableStock: number;

  @Field(() => [UpdateVariationFeatureInput])
  features?: [UpdateVariationFeatureInput];
}
