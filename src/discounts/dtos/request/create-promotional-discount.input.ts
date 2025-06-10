import { InputType, Field } from '@nestjs/graphql';
import {
  IsDate,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DiscountType } from 'src/shared/enums';

@InputType()
export class CreatePromotionalDiscountInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsUUID()
  productVariationId: string;

  @Field(() => String)
  discountType: DiscountType;

  @Field()
  @IsNumber()
  requiredAmount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  bonusQuantity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDecimal()
  discountPercentage?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  validUntil?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  availableStock?: number;
}
