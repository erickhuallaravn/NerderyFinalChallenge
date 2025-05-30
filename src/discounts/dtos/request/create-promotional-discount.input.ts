import { InputType, Field } from '@nestjs/graphql';
import { DiscountType } from 'src/shared/enums';

@InputType()
export class CreatePromotionalDiscountInput {
  @Field()
  name: string;

  @Field()
  productVariationId: string;

  @Field(() => String)
  discountType: DiscountType;

  @Field()
  requiredAmount: number;

  @Field({ nullable: true })
  bonusQuantity?: number;

  @Field({ nullable: true })
  discountPercentage?: number;

  @Field({ nullable: true })
  validUntil?: Date;

  @Field({ nullable: true })
  availableStock?: number;
}
