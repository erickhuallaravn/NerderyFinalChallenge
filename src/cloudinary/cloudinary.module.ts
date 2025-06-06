import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryService } from './services/cloudinary.service';
import { cloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports: [PrismaModule],
  providers: [cloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
