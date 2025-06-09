import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadProductFileInput } from '../../dtos/requests/product-file/upload-product-file.input';
import { ProductFile } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductFileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async upload(input: UploadProductFileInput): Promise<ProductFile> {
    const { file, productVariationId, altText } = input;
    const parsedFile = await file;

    const uploadedImage = await this.cloudinaryService.upload(parsedFile);

    return this.prisma.productFile.create({
      data: {
        productVariationId,
        fileExtension: uploadedImage.format,
        url: uploadedImage.secure_url,
        altText,
      },
    });
  }

  async delete(productFileId: string): Promise<boolean> {
    const file = await this.prisma.productFile.findUnique({
      where: { id: productFileId },
    });

    if (!file) return false;

    const segments = file.url.split('/');
    const filenameWithExt = segments[segments.length - 1];
    const publicId = `products/${filenameWithExt.split('.')[0]}`;

    await this.cloudinaryService.delete(publicId);

    await this.prisma.productFile.delete({ where: { id: productFileId } });

    return true;
  }
}
