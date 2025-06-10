import { Field, InputType, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ProductStatus } from 'src/shared/enums';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  status?: ProductStatus;
}
