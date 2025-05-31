import { ObjectType, Field, ID } from '@nestjs/graphql';
import { OrderHeaderStatus } from 'src/shared/enums';

@ObjectType()
export class OrderHeaderStatusHistory {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field()
  status: OrderHeaderStatus;

  @Field(() => Date)
  statusUpdatedAt: Date;
}
