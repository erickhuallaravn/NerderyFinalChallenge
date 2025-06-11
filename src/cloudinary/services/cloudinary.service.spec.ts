import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryProvider } from '../providers/cloudinary.provider';
import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';

describe('CloudinaryService (integration)', () => {
  let service: CloudinaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService, cloudinaryProvider],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should upload and delete a file from Cloudinary', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
    const streamFile = {
      createReadStream: () => fs.createReadStream(testFilePath),
      filename: 'test-image.jpg',
    };

    const result = await service.upload(streamFile);
    expect(result).toHaveProperty('secure_url');
    expect(result.public_id).toMatch(/products\/test-image/);

    await expect(service.delete(result.public_id)).resolves.not.toThrow();
  });

  it('should throw if cloudinary upload returns an error', async () => {
    const errorCloudinary = {
      uploader: {
        upload_stream: (_: any, callback: (err: any, res: any) => void) => {
          const writable = new Writable({
            write() {
              callback(null, null);
            },
          });

          process.nextTick(() => callback(new Error('Upload failed'), null));

          return writable;
        },
      },
    };

    const errorService = new CloudinaryService(errorCloudinary as any);

    await expect(
      errorService.upload({
        createReadStream: () =>
          fs.createReadStream(
            path.join(__dirname, 'fixtures', 'test-image.jpg'),
          ),
        filename: 'test-image.jpg',
      }),
    ).rejects.toThrow('Upload failed');
  });

  it('should throw if cloudinary returns undefined result', async () => {
    const undefinedResultCloudinary = {
      uploader: {
        upload_stream: (_: any, callback: (err: any, res: any) => void) => {
          const writable = new Writable({
            write() {
              callback(null, null);
            },
          });

          process.nextTick(() => callback(null, undefined));

          return writable;
        },
      },
    };

    const undefinedResultService = new CloudinaryService(
      undefinedResultCloudinary as any,
    );

    await expect(
      undefinedResultService.upload({
        createReadStream: () =>
          fs.createReadStream(
            path.join(__dirname, 'fixtures', 'test-image.jpg'),
          ),
        filename: 'test-image.jpg',
      }),
    ).rejects.toThrow('Cloudinary returned an undefined result');
  });
});
