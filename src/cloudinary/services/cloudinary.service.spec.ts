import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryProvider } from '../providers/cloudinary.provider';
import * as fs from 'fs';
import * as path from 'path';

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
});
