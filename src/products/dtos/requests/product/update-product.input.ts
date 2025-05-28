import { Field, InputType, ID } from '@nestjs/graphql';
import { ProductStatus } from 'src/shared/enums';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  productId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: ProductStatus;
}
