import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import { ProductStatus, CurrencyCode } from 'src/shared/enums';
import { UpdateVariationFeatureInput } from '../variation/update-variation-feature.input';
import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateProductVariationInput {
  @Field(() => ID)
  @IsUUID()
  productVariationId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsDecimal()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  currencyCode?: CurrencyCode;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  availableStock?: number;

  @Field(() => [UpdateVariationFeatureInput], { nullable: true })
  @IsOptional()
  features?: [UpdateVariationFeatureInput];

  @Field({ nullable: true })
  @IsOptional()
  status?: ProductStatus;
}
