import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const PASSWORD_ENCRYPT_ROUNDS: number = 10;

describe('User services functions', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should find user by credentials if valid', async () => {
    const password = 'correct-password';
    const hash = await bcrypt.hash(password, PASSWORD_ENCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: hash,
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.findByCredentials({
      email: user.email,
      password,
    });

    expect(result.email).toBe(user.email);
  });

  it('should throw NotFoundException if user is not found', async () => {
    await expect(
      service.findByCredentials({
        email: 'notfound@example.com',
        password: 'password',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('correct-password', 10),
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.findByCredentials({
        email: user.email,
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should create a new user with STANDARD_CUSTOMER role', async () => {
    const role = await prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER',
        description: 'The standard role for most of the customers',
        permissions: ['READ', 'UPDATE', 'WRITE', 'DELETE'],
      },
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const result = await service.create({
      newUserInfo: {
        firstName: 'newUserFirstName',
        lastName: 'newUserLastName',
        email: 'new@example.com',
        password: 'new-password',
      },
    });

    expect(result.email).toBe('new@example.com');

    await prisma.userRoles.create({
      data: {
        roleId: role.id,
        userId: result.id,
      },
    });

    const createdUser = await prisma.user.findUnique({
      where: { email: 'new@example.com' },
      include: {
        userRoles: true,
      },
    });

    expect(createdUser?.userRoles.length).toBeGreaterThan(0);
  });

  it('should throw ConflictException if email is already registered', async () => {
    await prisma.user.create({
      data: {
        email: 'existing@example.com',
        passwordHash: 'hash',
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    await expect(
      service.create({
        newUserInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'existing@example.com',
          password: '123456',
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if role not found', async () => {
    await expect(
      service.create({
        newUserInfo: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'new-password',
        },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update user password and return true', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'reset@example.com',
        passwordHash: 'old-hash',
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');

    const result = await service.updatePassword('new-password', {
      sub: user.id,
      customerId: 'customer_id',
      userType: 'CUSTOMER',
      tokenVersion: 'version',
    });

    expect(result).toBe(true);

    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated?.passwordHash).toBe('new-hash');
  });
});
