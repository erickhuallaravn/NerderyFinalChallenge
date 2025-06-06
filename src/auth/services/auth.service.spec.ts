/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RolePermission } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { PASSWORD_ENCRYPT_ROUNDS } from 'src/common/constants/app.constants';
import { LogInInput } from '../dtos/requests/login/login.input';

describe('AuthService (DB-based)', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let mailerService: MailerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [PrismaService],
    }).compile();

    service = module.get(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
    mailerService = module.get(MailerService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('login()', () => {
    it('should login a user and set tokenVersion if null', async () => {
      const rawPassword: string = 'secret123';
      const hashed: string = await bcrypt.hash(
        rawPassword,
        PASSWORD_ENCRYPT_ROUNDS,
      );

      const user = await prisma.user.create({
        data: {
          email: 'test@login.com',
          passwordHash: hashed,
          userType: 'CUSTOMER',
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });

      await prisma.customer.create({
        data: {
          userId: user.id,
          firstName: 'Customer',
          lastName: 'Test',
          address: 'Some address',
          phoneNumber: '123456',
          birthday: new Date(),
        },
      });

      const input: LogInInput = {
        email: user.email,
        password: rawPassword,
      };
      const token = await service.login(input);

      expect(typeof token).toBe('string');

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.tokenVersion).toBeDefined();
    });

    it('should login a user and reuse existing tokenVersion if not null', async () => {
      const rawPassword = 'secret123';
      const hashed = await bcrypt.hash(rawPassword, PASSWORD_ENCRYPT_ROUNDS);

      const user = await prisma.user.create({
        data: {
          email: 'test2@login.com',
          passwordHash: hashed,
          userType: 'CUSTOMER',
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
          tokenVersion: 'existing-version',
        },
      });

      await prisma.customer.create({
        data: {
          userId: user.id,
          firstName: 'Customer',
          lastName: 'Test',
          address: 'Some address',
          phoneNumber: '123456',
          birthday: new Date(),
        },
      });

      const input: LogInInput = { email: user.email, password: rawPassword };
      const token = await service.login(input);

      expect(typeof token).toBe('string');

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.tokenVersion).toBe('existing-version'); // no cambio tokenVersion
    });
  });

  describe('registerCustomer()', () => {
    it('should create a new customer, assign role, and return token', async () => {
      await prisma.role.create({
        data: {
          name: 'STANDARD_CUSTOMER',
          description: 'Standard role',
          permissions: [
            RolePermission.READ,
            RolePermission.WRITE,
            RolePermission.UPDATE,
            RolePermission.DELETE,
          ],
        },
      });

      const token = await service.registerCustomer({
        email: 'customer@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(typeof token).toBe('string');

      const user = await prisma.user.findUnique({
        where: { email: 'customer@test.com' },
      });
      expect(user).toBeDefined();

      const userRoles = await prisma.userRoles.findMany({
        where: { userId: user!.id },
      });
      expect(userRoles.length).toBeGreaterThan(0);
    });
  });

  describe('logout()', () => {
    it('should clear tokenVersion', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'logout@test.com',
          passwordHash: 'dummy',
          userType: 'CUSTOMER',
          tokenVersion: 'v1',
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });

      await service.logout(user.id);

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.tokenVersion).toBeNull();
    });
  });

  describe('sendRecoverEmail()', () => {
    it('should send a recovery email with a token', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'recover@test.com',
          passwordHash: 'dummy',
          userType: 'CUSTOMER',
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });

      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockResolvedValueOnce({} as any);

      await service.sendRecoverEmail(user.email);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: 'Welcome!',
          template: '../../templates/welcome',
          context: expect.objectContaining({
            token: expect.any(String),
          }),
        }),
      );

      spy.mockRestore();
    });

    it('should throw if user is not found', async () => {
      await expect(
        service.sendRecoverEmail('unknown@mail.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if mailerService.sendMail fails', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'failmail@test.com',
          passwordHash: 'dummy',
          userType: 'CUSTOMER',
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });

      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValueOnce(new Error('Mail failed'));

      await expect(service.sendRecoverEmail(user.email)).rejects.toThrow(
        'Mail failed',
      );
    });
  });

  describe('updatePassword()', () => {
    it('should update password if token is valid', async () => {
      const oldPassword = 'oldpass';
      const newPassword = 'newpass';

      const hashed = await bcrypt.hash(oldPassword, PASSWORD_ENCRYPT_ROUNDS);
      const user = await prisma.user.create({
        data: {
          email: 'changepass@test.com',
          passwordHash: hashed,
          userType: 'CUSTOMER',
          status: 'ACTIVE',
          statusUpdatedAt: new Date(),
        },
      });

      const token = await jwtService.signAsync(
        { sub: user.id },
        { expiresIn: '15m' },
      );

      const result = await service.updatePassword(token, newPassword);
      expect(result).toBe(true);

      const updated = await prisma.user.findUnique({ where: { id: user.id } });
      const match = await bcrypt.compare(newPassword, updated!.passwordHash);
      expect(match).toBe(true);
    });

    it('should throw if token is invalid', async () => {
      await expect(
        service.updatePassword('invalid.token', 'pass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
