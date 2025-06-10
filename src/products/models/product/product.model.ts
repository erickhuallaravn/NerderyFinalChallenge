import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductStatus } from 'src/shared/enums';
import { ProductVariation } from '../product-variation/product-variation.model';
import { Product as ProductEntity } from '@prisma/client';

@ObjectType()
export class Product implements ProductEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  status: ProductStatus;

  @Field()
  statusUpdatedAt: Date;

  @Field(() => [ProductVariation])
  variations: ProductVariation[];
}
