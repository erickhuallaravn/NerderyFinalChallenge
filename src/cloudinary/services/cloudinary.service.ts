import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async upload(file: {
    createReadStream: () => Readable;
    filename: string;
  }): Promise<UploadApiResponse> {
    const { createReadStream, filename } = file;

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          public_id: filename.split('.')[0],
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result)
            return reject(new Error('Cloudinary returned an undefined result'));
          resolve(result);
        },
      );

      createReadStream().pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }
}
