import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createCheckoutSession(jwtInfo: JwtPayload): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: jwtInfo.sub,
      },
    });
    if (!user) {
      throw new NotFoundException('El cliente specificado no existe');
    }
    const order = await this.prisma.orderHeader.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        statusHistory: {
          some: {
            status: 'PENDING_PAYMENT',
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(
        'El cliente no tiene un pedido reciente pendiente de pago',
      );
    }
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Order #' + order.id },
            unit_amount: Math.round(Number(order.subtotal) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
      metadata: { orderId: order.id },
    });

    return String(session.url);
  }

  handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = String(process.env.STRIPE_WEBHOOK_SECRET);
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  }
  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
