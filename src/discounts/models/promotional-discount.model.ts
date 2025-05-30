import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DiscountType, PromotionStatus } from 'src/shared/enums';

@ObjectType()
export class PromotionalDiscount {
  @Field(() => ID)
  id: string;

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
  validSince?: Date;

  @Field({ nullable: true })
  validUntil?: Date;

  @Field({ nullable: true })
  availableStock?: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => String)
  status: PromotionStatus;

  @Field()
  statusUpdatedAt: Date;
}
