import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Feature } from '../feature/feature.model';
import { Option } from './option.model';
import { RowStatus } from 'src/shared/enums';

@ObjectType()
export class OptionValue {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  optionId: string;

  @Field(() => Option)
  option: Option;

  @Field(() => Feature)
  variations: Feature[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  status: RowStatus;

  @Field()
  statusUpdatedAt: Date;
}
