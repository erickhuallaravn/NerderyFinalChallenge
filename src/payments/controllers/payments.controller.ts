import {
  Controller,
  Post,
  Request,
  Get,
  Query,
  Headers,
  Req,
  UseGuards,
  NotFoundException,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from '../../stripe/services/stripe.service';
import Stripe from 'stripe';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Controller('payment')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  // Protegido con JWT
  @UseGuards(JwtStrategy)
  @Post('checkout')
  async createCheckoutSession(
    @Request() req: JwtPayload,
  ): Promise<{ url: string }> {
    const url: string = await this.stripeService.createCheckoutSession(req);
    return { url };
  }

  @Get('success')
  async paymentSuccess(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new NotFoundException('session_id requerido');
    }

    const session: Stripe.Checkout.Session =
      await this.stripeService.retrieveSession(sessionId);
    return {
      message: 'Pago exitoso',
      sessionId,
      email: session.customer_email,
      orderId: session.metadata?.orderId,
    };
  }

  @Get('cancel')
  paymentCancelled() {
    return { message: 'El pago fue cancelado por el usuario' };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException(
        'No se recibió el cuerpo de la solicitud como rawBody',
      );
    }

    const event = this.stripeService.handleWebhook(rawBody, sig);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`Pago confirmado para orden: ${session.metadata?.orderId}`);
        break;
      default:
        console.log(`ℹEvento ignorado: ${event.type}`);
    }

    return { received: true };
  }
}
