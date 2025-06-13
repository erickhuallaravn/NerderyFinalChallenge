import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/services/stripe.service';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { OrderHeaderStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createCheckoutSession(authPayload: JwtPayload): Promise<string> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: authPayload.sub },
    });

    const order = await this.prisma.orderHeader.findFirstOrThrow({
      where: {
        statusHistory: {
          some: { status: OrderHeaderStatus.PENDING_PAYMENT },
        },
        customerId: authPayload.customerId!,
      },
      orderBy: { createdAt: 'desc' },
    });

    const session = await this.stripeService.createCheckoutSession({
      payment_method_types: ['card', 'amazon_pay', 'paypal'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: order.currencyCode,
            product_data: { name: 'Order #' + order.id },
            unit_amount: Math.round(Number(order.total) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
      metadata: { orderId: order.id },
    });

    return session.url!;
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripeService.retrieveSession(sessionId);
  }

  handleWebhook(rawBody: Buffer, signature: string): Stripe.Event {
    return this.stripeService.handleWebhook(rawBody, signature);
  }

  async markOrderAsPaid(orderId: string): Promise<void> {
    const alreadyPaid = await this.prisma.orderHeader.findFirst({
      where: {
        id: orderId,
        statusHistory: {
          some: {
            status: OrderHeaderStatus.PAID,
          },
        },
      },
    });

    if (alreadyPaid) return;

    await this.prisma.orderHeaderStatusHistory.create({
      data: {
        orderHeaderId: orderId,
        status: OrderHeaderStatus.PAID,
        statusUpdatedAt: new Date(),
      },
    });

    await this.prisma.orderHeader.update({
      where: { id: orderId },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}
