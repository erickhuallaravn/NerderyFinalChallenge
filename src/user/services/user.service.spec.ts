import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const PASSWORD_ENCRYPT_ROUNDS = 10;

describe('UserService', () => {
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createStandardRole = () =>
    prisma.role.create({
      data: {
        name: 'STANDARD_CUSTOMER',
        description: 'Standard customer role',
        permissions: ['READ', 'UPDATE', 'WRITE', 'DELETE'],
      },
    });

  it('should find user by credentials if valid', async () => {
    await createStandardRole();

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
        password: 'irrelevant',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    await createStandardRole();

    const passwordHash = await bcrypt.hash(
      'correct-password',
      PASSWORD_ENCRYPT_ROUNDS,
    );

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash,
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    await expect(
      service.findByCredentials({
        email: user.email,
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should create a new user with STANDARD_CUSTOMER role', async () => {
    await createStandardRole();

    const result = await service.createCustomer({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'secure-password',
    });

    expect(result.email).toBe('alice@example.com');

    const createdUser = await prisma.user.findUnique({
      where: { id: result.id },
      include: { userRoles: true },
    });

    expect(createdUser?.userRoles.length).toBeGreaterThan(0);
  });

  it('should throw ConflictException if email is already registered', async () => {
    await createStandardRole();

    await prisma.user.create({
      data: {
        email: 'taken@example.com',
        passwordHash: 'irrelevant-hash',
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    await expect(
      service.createCustomer({
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'taken@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if role not found', async () => {
    await expect(
      service.createCustomer({
        firstName: 'NoRole',
        lastName: 'User',
        email: 'norole@example.com',
        password: 'abc123',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update user password and return true', async () => {
    await createStandardRole();

    const user = await prisma.user.create({
      data: {
        email: 'changepass@example.com',
        passwordHash: await bcrypt.hash(
          'old-password',
          PASSWORD_ENCRYPT_ROUNDS,
        ),
        userType: 'CUSTOMER',
        tokenVersion: null,
        createdAt: new Date(),
        updatedAt: null,
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
      },
    });

    const result = await service.updatePassword('new-password', {
      sub: user.id,
      customerId: 'dummy-customer',
      userType: 'CUSTOMER',
      tokenVersion: '1',
    });

    expect(result).toBe(true);

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const isMatch = await bcrypt.compare(
      'new-password',
      updatedUser!.passwordHash,
    );
    expect(isMatch).toBe(true);
  });
});
