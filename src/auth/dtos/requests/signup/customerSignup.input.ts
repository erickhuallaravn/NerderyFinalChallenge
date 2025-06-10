import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CustomerSignUpInput {
  @Field()
  address?: string;

  @Field()
  @IsDate()
  birthday?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsStrongPassword()
  password: string;

  @Field()
  @IsPhoneNumber()
  phoneNumber?: string;
}
