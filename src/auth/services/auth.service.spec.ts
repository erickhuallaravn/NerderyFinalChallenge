import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/services/user.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import {
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthService Unit Tests', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let customerService: jest.Mocked<CustomerService>;
  let prisma: {
    user: {
      update: jest.Mock;
      findUnique: jest.Mock;
    };
    customer: {
      findUnique: jest.Mock;
    };
  };
  let jwtService: jest.Mocked<JwtService>;
  let mailerService: jest.Mocked<MailerService>;

  beforeEach(async () => {
    userService = {
      findByCredentials: jest.fn(),
      updatePassword: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    customerService = {
      create: jest.fn(),
    } as unknown as jest.Mocked<CustomerService>;

    prisma = {
      user: {
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      customer: {
        findUnique: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mailerService = {
      sendMail: jest.fn(),
    } as unknown as jest.Mocked<MailerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: CustomerService, useValue: customerService },
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: MailerService, useValue: mailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login a valid user with null tokenVersion and return a token', async () => {
    userService.findByCredentials.mockResolvedValue({
      id: 'user-1',
      email: 'test@mail.com',
      passwordHash: 'hash',
      userType: 'CUSTOMER',
      tokenVersion: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE',
      statusUpdatedAt: new Date(),
    });

    prisma.customer.findUnique.mockResolvedValue({ id: 'customer-1' });
    prisma.user.update.mockResolvedValue({});
    jwtService.signAsync.mockResolvedValue('token-123');

    const token = await service.login({
      email: 'test@mail.com',
      password: '123456',
    });

    expect(token).toBe('token-123');
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('should login a valid user with existing tokenVersion', async () => {
    userService.findByCredentials.mockResolvedValue({
      id: 'user-2',
      email: 'existing@mail.com',
      passwordHash: 'hash',
      userType: 'CUSTOMER',
      tokenVersion: 'existing-version',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE',
      statusUpdatedAt: new Date(),
    });

    prisma.customer.findUnique.mockResolvedValue({ id: 'customer-2' });
    jwtService.signAsync.mockResolvedValue('token-456');

    const token = await service.login({
      email: 'existing@mail.com',
      password: 'password',
    });

    expect(token).toBe('token-456');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if login user is not found', async () => {
    userService.findByCredentials.mockRejectedValue(
      new NotFoundException('El usuario no se encuentra registrado.'),
    );

    await expect(
      service.login({ email: 'wrong@mail.com', password: 'wrong' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should register a customer and return a token', async () => {
    customerService.create.mockResolvedValue({
      customer: {
        id: 'customer-123',
        userId: 'user-123',
        firstName: 'First',
        lastName: 'Last',
        address: 'Address',
        phoneNumber: '123456',
        birthday: new Date(),
        createdAt: new Date(),
        updatedAt: null,
      },
      tokenVersion: 'tv-123',
    });

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      userRoles: [
        {
          role: {
            name: 'CUSTOMER',
            permissions: [],
          },
        },
      ],
    });

    jwtService.signAsync.mockResolvedValue('signup-token');

    const token = await service.registerCustomer({
      email: 'new@mail.com',
      password: 'pass',
      firstName: 'First',
      lastName: 'Last',
    });

    expect(token).toBe('signup-token');
    expect(customerService.create).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'user-123',
        customerId: 'customer-123',
        userType: 'CUSTOMER',
        tokenVersion: 'tv-123',
        roles: ['CUSTOMER'],
      }),
    );
  });

  it('should throw InternalServerError if user has no roles after registration', async () => {
    customerService.create.mockResolvedValue({
      customer: {
        id: 'customer-123',
        userId: 'user-123',
        firstName: 'First',
        lastName: 'Last',
        address: 'Address',
        phoneNumber: '123456',
        birthday: new Date(),
        createdAt: new Date(),
        updatedAt: null,
      },
      tokenVersion: 'tv-123',
    });

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      userRoles: [],
    });

    await expect(
      service.registerCustomer({
        email: 'new@mail.com',
        password: 'pass',
        firstName: 'First',
        lastName: 'Last',
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
