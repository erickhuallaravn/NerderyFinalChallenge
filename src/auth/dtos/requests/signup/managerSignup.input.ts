import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ManagerSignUpInput {
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
