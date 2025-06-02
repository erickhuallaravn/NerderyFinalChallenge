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
import { StripeService } from '../../stripe/services/stripe.service';
import Stripe from 'stripe';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  // Protegido con JWT
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckoutSession(
    @CurrentUser() req: JwtPayload,
  ): Promise<{ url: string }> {
    const url: string = await this.stripeService.createCheckoutSession(req);
    return { url };
  }

  @Get('success')
  async paymentSuccess(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new NotFoundException('session_id required');
    }

    const session: Stripe.Checkout.Session =
      await this.stripeService.retrieveSession(sessionId);
    return {
      message: 'Succesful payment',
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
      throw new BadRequestException(
        'The request body was not received',
      );
    }

    const event = this.stripeService.handleWebhook(rawBody, sig);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`Checkout confirmed for: ${session.metadata?.orderId}`);
        break;
      default:
        console.log(`Ignored event: ${event.type}`);
    }

    return { received: true };
  }
}
