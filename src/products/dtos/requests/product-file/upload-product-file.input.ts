import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class UploadProductFileInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;

  @Field()
  @IsUUID()
  productVariationId: string;

  @Field()
  @IsString()
  altText: string;
}
