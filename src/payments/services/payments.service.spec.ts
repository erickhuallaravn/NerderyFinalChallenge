import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/services/stripe.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { OrderHeaderStatus, RolePermission } from '@prisma/client';
import { CustomerSignUpInput } from 'src/auth/dtos/requests/signup/customerSignup.input';
import { LogInInput } from 'src/auth/dtos/requests/login/login.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

describe('PaymentsService (integration)', () => {
  let service: PaymentsService;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;

  let authPayload: JwtPayload;
  let jwtToken: string;

  const customerLogInInput: LogInInput = {
    email: 'payment@test.com',
    password: 'password123',
  };

  const customerSignUpInput: CustomerSignUpInput = {
    email: customerLogInInput.email,
    password: customerLogInInput.password,
    firstName: 'Pay',
    lastName: 'User',
  };

  const stripeMock = {
    createCheckoutSession: jest
      .fn()
      .mockResolvedValue({ url: 'https://fake.stripe/checkout' }),
    retrieveSession: jest
      .fn()
      .mockResolvedValue({ id: 'cs_test_123', object: 'checkout.session' }),
    handleWebhook: jest.fn().mockReturnValue({
      id: 'evt_test_123',
      type: 'checkout.session.completed',
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        PaymentsService,
        PrismaService,
        {
          provide: StripeService,
          useValue: stripeMock,
        },
      ],
    }).compile();

    service = module.get(PaymentsService);
    prisma = module.get(PrismaService);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();

    await prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER_ROLE',
        description: 'Customer',
        permissions: [
          RolePermission.READ,
          RolePermission.WRITE,
          RolePermission.UPDATE,
        ],
      },
    });

    jwtToken = await authService.registerCustomer(customerSignUpInput);
    authPayload = await jwtService.verifyAsync(jwtToken);

    await prisma.orderHeader.create({
      data: {
        customerId: authPayload.customerId!,
        currencyCode: 'USD',
        total: 99.99,
        statusHistory: {
          create: {
            status: OrderHeaderStatus.PENDING_PAYMENT,
            statusUpdatedAt: new Date(),
          },
        },
      },
      include: { statusHistory: true },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createCheckoutSession', () => {
    it('should create a Stripe checkout session URL', async () => {
      const url = await service.createCheckoutSession(authPayload);
      expect(typeof url).toBe('string');
      expect(url).toContain('https://');
      expect(stripeMock.createCheckoutSession).toHaveBeenCalled();
    });
  });

  describe('retrieveSession', () => {
    it('should return a Stripe session object', async () => {
      const session = await service.retrieveSession('cs_test_123');
      expect(session).toHaveProperty('id');
      expect(stripeMock.retrieveSession).toHaveBeenCalledWith('cs_test_123');
    });
  });

  describe('handleWebhook', () => {
    it('should return a Stripe event', () => {
      const raw = Buffer.from('test');
      const sig = 'signature';
      const result = service.handleWebhook(raw, sig);
      expect(result).toHaveProperty('id');
      expect(stripeMock.handleWebhook).toHaveBeenCalledWith(raw, sig);
    });
  });

  describe('markOrderAsPaid', () => {
    it('should mark an order as paid', async () => {
      const newOrder = await prisma.orderHeader.create({
        data: {
          customerId: authPayload.customerId!,
          currencyCode: 'USD',
          total: 10.0,
          statusHistory: {
            create: {
              status: OrderHeaderStatus.PENDING_PAYMENT,
              statusUpdatedAt: new Date(),
            },
          },
        },
        include: { statusHistory: true },
      });

      await service.markOrderAsPaid(newOrder.id);

      const paidStatus = await prisma.orderHeaderStatusHistory.findFirst({
        where: {
          orderHeaderId: newOrder.id,
          status: OrderHeaderStatus.PAID,
        },
      });

      expect(paidStatus).toBeDefined();
    });

    it('should skip if already marked as paid', async () => {
      const order = await prisma.orderHeader.create({
        data: {
          customerId: authPayload.customerId!,
          currencyCode: 'USD',
          total: 15.0,
          statusHistory: {
            create: {
              status: OrderHeaderStatus.PAID,
              statusUpdatedAt: new Date(),
            },
          },
        },
      });

      await expect(service.markOrderAsPaid(order.id)).resolves.toBeUndefined();

      const count = await prisma.orderHeaderStatusHistory.count({
        where: {
          orderHeaderId: order.id,
          status: OrderHeaderStatus.PAID,
        },
      });

      expect(count).toBe(1);
    });
  });
});
