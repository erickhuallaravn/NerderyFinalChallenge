import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { PaymentController } from './controllers/payments.controller';

@Module({
  imports: [PrismaModule, StripeModule],
  providers: [PaymentsService],
  controllers: [PaymentController],
})
export class PaymentsModule {}
