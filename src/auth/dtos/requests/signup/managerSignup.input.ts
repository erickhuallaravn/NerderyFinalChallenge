import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class ManagerSignUpInput {
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

  @Field({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
