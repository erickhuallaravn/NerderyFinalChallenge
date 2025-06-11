import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/services/user.service';
import { CustomerSignUpInput } from 'src/auth/dtos/requests/signup/customerSignup.input';
import { UserType, UserStatus, RolePermission } from '@prisma/client';

describe('CustomerService (DB-based)', () => {
  const customerCreateInput: CustomerSignUpInput = {
    email: 'test@customer.com',
    password: '123456',
    firstName: 'Test',
    lastName: 'Customer',
    address: '123 Street',
    phoneNumber: '1234567890',
    birthday: '2000-01-01',
  };

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
    await prisma.cleanDatabase();

    await prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER_ROLE',
        description: 'Standard role for customer',
        permissions: [
          RolePermission.READ,
          RolePermission.UPDATE,
          RolePermission.WRITE,
          RolePermission.DELETE,
        ],
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create()', () => {
    it('should create a user and customer with correct data', async () => {
      const customer = await service.create(customerCreateInput);

      expect(customer).toBeDefined();
      expect(customer.user).toBeDefined();
      expect(customer.user.tokenVersion).toBeDefined();
      expect(customer.user.email).toBe(customerCreateInput.email);
      expect(customer.user.userType).toBe(UserType.CUSTOMER);
      expect(customer.user.status).toBe(UserStatus.ACTIVE);
    });
  });
});
