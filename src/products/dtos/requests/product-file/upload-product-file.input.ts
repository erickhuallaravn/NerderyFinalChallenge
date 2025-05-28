import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class UploadProductFileInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;

  @Field()
  productVariationId: string;

  @Field()
  altText: string;
}
