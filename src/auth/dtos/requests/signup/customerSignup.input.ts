import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CustomerSignUpInput {
  @Field()
  address?: string;

  @Field()
  birthday?: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field()
  phoneNumber?: string;
}
