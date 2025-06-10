import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CustomerSignUpInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
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

  @Field({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
