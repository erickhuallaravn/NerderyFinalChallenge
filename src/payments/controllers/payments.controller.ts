import {
  Controller,
  Post,
  Get,
  Query,
  Headers,
  Req,
  UseGuards,
  NotFoundException,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaymentsService } from '../services/payments.service';
import Stripe from 'stripe';
import { ValidCustomerPayload } from 'src/auth/decorators/valid-auth-payload.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckoutSession(
    @CurrentUser() @ValidCustomerPayload() authPayload: JwtPayload,
  ): Promise<{ url: string }> {
    const url = await this.paymentsService.createCheckoutSession(authPayload);
    return { url };
  }

  @Get('success')
  async paymentSuccess(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new NotFoundException('session_id required');
    }

    const session: Stripe.Checkout.Session =
      await this.paymentsService.retrieveSession(sessionId);

    return {
      message: 'Successful payment',
      sessionId,
      email: session.customer_email,
      orderId: session.metadata?.orderId,
    };
  }

  @Get('cancel')
  paymentCancelled() {
    return { message: 'The payment was cancelled by user' };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('The request body was not received');
    }

    const event = this.paymentsService.handleWebhook(rawBody, sig);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const orderId = session.metadata?.orderId;
        if (!orderId) {
          console.warn('No orderId found in session metadata');
          break;
        }

        await this.paymentsService.markOrderAsPaid(orderId);
        console.log(`Checkout confirmed and marked as paid: ${orderId}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        console.warn(`Payment session expired for order: ${orderId}`);
        // Aquí podrías marcar el pedido como cancelado/expirado
        break;
      }

      default:
        console.log(`Ignored Stripe event: ${event.type}`);
    }

    return { received: true };
  }
}
