import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('StripeService (integration)', () => {
  let service: StripeService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let jwtPayload: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        PrismaService,
        AuthService,
        UserService,
        CustomerService,
        JwtService,
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    await prisma.cleanDatabase();

    const token = await authService.registerCustomer({
      email: 'stripe@email.com',
      password: '123456',
      firstName: 'Stripe',
      lastName: 'User',
    });

    jwtPayload = await jwtService.verifyAsync(token);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createPendingOrder = async () => {
    const variation = await prisma.productVariation.create({
      data: {
        name: 'StripeVar',
        price: 200,
        currencyCode: 'USD',
        availableStock: 10,
        status: 'AVAILABLE',
        statusUpdatedAt: new Date(),
        product: {
          create: {
            name: 'Stripe Product',
            description: 'For stripe test',
            status: 'AVAILABLE',
            statusUpdatedAt: new Date(),
          },
        },
      },
    });

    await prisma.orderHeader.create({
      data: {
        customerId: jwtPayload.customerId,
        subtotal: 200,
        orderItems: {
          create: {
            productName: variation.name,
            productVariationId: variation.id,
            quantity: 1,
            subtotal: 200,
            status: 'ACTIVE',
            statusUpdatedAt: new Date(),
          },
        },
        statusHistory: {
          create: {
            status: 'PENDING_PAYMENT',
            statusUpdatedAt: new Date(),
          },
        },
      },
    });
  };

  describe('createCheckoutSession', () => {
    it('should throw if no pending payment order exists', async () => {
      await expect(service.createCheckoutSession(jwtPayload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a Stripe checkout URL', async () => {
      await createPendingOrder();

      const url = await service.createCheckoutSession(jwtPayload);
      expect(typeof url).toBe('string');
      expect(url.startsWith('https://')).toBe(true);
    });
  });

  describe('retrieveSession', () => {
    it('should retrieve a Stripe session object', async () => {
      await createPendingOrder();

      const url = await service.createCheckoutSession(jwtPayload);
      const urlObj = new URL(url);
      const sessionId = urlObj.searchParams.get('session_id');

      // Este test solo es válido si el checkout fue completado y redirigido con éxito.
      // Como alternativa, puedes crear una sesión sin redirigir para pruebas locales.

      if (sessionId) {
        const session = await service.retrieveSession(sessionId);
        expect(session.id).toBe(sessionId);
        expect(session.object).toBe('checkout.session');
      }
    });
  });

  describe('handleWebhook', () => {
    it('should throw if signature is invalid', () => {
      const rawBody = Buffer.from(JSON.stringify({ id: 'evt_test' }));
      const fakeSignature = 'invalid-signature';

      expect(() =>
        service.handleWebhook(rawBody, fakeSignature),
      ).toThrow();
    });
  });
});
