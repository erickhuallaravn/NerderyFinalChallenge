import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LogInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
