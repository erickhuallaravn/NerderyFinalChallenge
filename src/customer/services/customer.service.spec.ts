import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/services/user.service';
import { SignUpInput } from 'src/auth/dtos/requests/signup/signup.input';
import { UserType, UserStatus } from 'generated/prisma';

describe('CustomerService (DB-based)', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService, PrismaService, UserService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase?.();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create()', () => {
    it('should create a user and customer with correct data', async () => {
      const input: SignUpInput = {
        email: 'test@customer.com',
        password: '123456',
        firstName: 'Test',
        lastName: 'Customer',
        address: '123 Street',
        phoneNumber: '1234567890',
        birthday: '2000-01-01',
      };

      const result = await service.create(input);

      expect(result.customer).toBeDefined();
      expect(result.customer.firstName).toBe('Test');
      expect(result.tokenVersion).toBeDefined();

      const user = await prisma.user.findUnique({
        where: { id: result.customer.userId },
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe(input.email);
      expect(user?.userType).toBe(UserType.CUSTOMER);
      expect(user?.status).toBe(UserStatus.ACTIVE);
    });
  });
});
