import { Module } from '@nestjs/common';
import { PromotionalDiscountService } from './services/promotional-discount.service';
import { PromotionalDiscountsResolver } from './resolvers/promotional-discount.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PromotionalDiscountService, PromotionalDiscountsResolver],
})
export class PromotionalDiscountsModule {}
