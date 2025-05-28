import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductVariation } from '../product-variation/product-variation.model';

@ObjectType()
export class ProductFile {
  @Field(() => ID)
  id: string;

  @Field()
  productVariationId: string;

  @Field()
  fileExtension: string;

  @Field()
  url: string;

  @Field()
  altText: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ProductVariation)
  productVariation: ProductVariation;
}
