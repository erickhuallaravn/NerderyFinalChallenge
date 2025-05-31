import { Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from 'src/payments/controllers/payments.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
