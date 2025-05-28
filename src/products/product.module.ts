import { Module } from '@nestjs/common';
import { ProductService } from './services/product/product.service';
import { ProductVariationService } from './services/product-variation/product-variation.service';
import { ProductResolver } from './resolvers/product/product.resolver';
import { ProductVariationResolver } from './resolvers/product-variation/product-variation.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductFileService } from './services/product-file/product-file.service';
import { ProductFileResolver } from './resolvers/product-file/product-file.resolver';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FeatureResolver } from './resolvers/feature/feature.resolver';
import { FeatureService } from './services/feature/feature.service';
import { OptionService } from './services/option/option.service';
import { OptionValueService } from './services/option/option-value.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [
    ProductService,
    ProductResolver,
    ProductVariationService,
    ProductVariationResolver,
    ProductFileService,
    ProductFileResolver,
    FeatureResolver,
    FeatureService,
    OptionService,
    OptionValueService,
  ],
})
export class ProductModule {}
