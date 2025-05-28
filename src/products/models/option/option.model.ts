import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OptionValue } from './option-value.model';

@ObjectType()
export class Option {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field(() => OptionValue)
  values: OptionValue[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
