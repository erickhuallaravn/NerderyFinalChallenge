// src/stripe/services/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createCheckoutSession(data: Stripe.Checkout.SessionCreateParams) {
    return this.stripe.checkout.sessions.create(data);
  }

  handleWebhook(rawBody: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      String(process.env.STRIPE_WEBHOOK_SECRET),
    );
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
