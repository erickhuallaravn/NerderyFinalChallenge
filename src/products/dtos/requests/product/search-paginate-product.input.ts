import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SearchPaginateProductInput {
  @Field({ nullable: true })
  search?: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}
