/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UnauthorizedException } from '@nestjs/common';
import { RolePermission, RowStatus, User, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { PASSWORD_ENCRYPT_ROUNDS } from 'src/common/constants/app.constants';
import { LogInInput } from '../dtos/requests/login/login.input';
import { JwtPayload } from '../types/jwt-payload.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CustomerSignUpInput } from '../dtos/requests/signup/customerSignup.input';
import { ManagerSignUpInput } from '../dtos/requests/signup/managerSignup.input';
import { ResetPasswordInput } from '../dtos/requests/resetPassword/resetPassword.input';

describe('AuthService', () => {
  let authPayload: JwtPayload;
  let jwtToken: string;
  let user: User | null;
  const loginInput: LogInInput = {
    email: 'test@login.com',
    password: 'testPassword',
  };
  const customerSignUpInput: CustomerSignUpInput = {
    email: 'customer@login.com',
    password: 'customerPassword',
    firstName: 'customerFirstName',
    lastName: 'customerLastName',
  };
  const managerSignUpInput: ManagerSignUpInput = {
    email: 'manager@login.com',
    password: 'managerpassword',
    firstName: 'managerFirstName',
    lastName: 'managerLastName',
  };
  const resetPasswordInput: ResetPasswordInput = {
    newPassword: 'newPassword',
    token: uuidv4(),
  };

  let customerRoleId: string;
  let managerRoleId: string;

  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let mailerService: MailerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    service = module.get(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
    mailerService = module.get(MailerService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();

    const hashed: string = await bcrypt.hash(
      loginInput.password,
      PASSWORD_ENCRYPT_ROUNDS,
    );
    user = await prisma.user.create({
      data: {
        email: loginInput.email,
        passwordHash: hashed,
        userType: UserType.MANAGER,
        status: RowStatus.ACTIVE,
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
    const customerRole = await prisma.role.create({
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
    customerRoleId = customerRole.id;
    const managerRole = await prisma.role.create({
      data: {
        name: 'STANDARD_MANAGER_ROLE',
        description: 'Standard role for manager',
        permissions: [
          RolePermission.READ,
          RolePermission.UPDATE,
          RolePermission.WRITE,
          RolePermission.DELETE,
        ],
      },
    });
    managerRoleId = managerRole.id;
    await prisma.userRoles.create({
      data: {
        userId: user.id,
        roleId: customerRole.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('hashPassword()', () => {
    it('should hash password correctly', async () => {
      const rawPassword = 'myRawPassword';
      const hashed = await service.hashPassword(rawPassword);
      expect(await bcrypt.compare(rawPassword, hashed)).toBe(true);
    });
  });

  describe('login()', () => {
    it('should login a user and set tokenVersion if null', async () => {
      jwtToken = await service.login(loginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      expect(typeof jwtToken).toBe('string');
      const updatedUser = await prisma.user.findUnique({
        where: { id: user!.id },
      });
      expect(updatedUser?.tokenVersion).toBeDefined();
    });

    it('should login a user and reuse existing tokenVersion if not null', async () => {
      const existingTokenVersion: string = uuidv4();
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          tokenVersion: {
            set: existingTokenVersion,
          },
        },
      });

      jwtToken = await service.login(loginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      const updatedUser = await prisma.user.findUnique({
        where: { id: user!.id },
      });
      expect(updatedUser?.tokenVersion).toBe(existingTokenVersion);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      loginInput.password = 'incorrectpassword';

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('registerCustomer()', () => {
    it('should create a new customer and return token', async () => {
      jwtToken = await service.registerCustomer(customerSignUpInput);
      expect(typeof jwtToken).toBe('string');
    });

    it('should throw if STANDARD_CUSTOMER role is missing', async () => {
      await prisma.role.delete({
        where: { id: customerRoleId },
      });
      await expect(
        service.registerCustomer(customerSignUpInput),
      ).rejects.toThrow(PrismaClientKnownRequestError);
    });
  });

  describe('registerManager()', () => {
    it('should create a new manager and return token', async () => {
      jwtToken = await service.login(loginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      jwtToken = await service.registerManager(managerSignUpInput, authPayload);
      expect(typeof jwtToken).toBe('string');
    });

    it('should throw if STANDARD_MANAGER role is missing', async () => {
      await prisma.role.delete({
        where: {
          id: managerRoleId,
        },
      });
      jwtToken = await service.login(loginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      await expect(
        service.registerManager(managerSignUpInput, authPayload),
      ).rejects.toThrow(PrismaClientKnownRequestError);
    });
  });

  describe('logout()', () => {
    it('should clear tokenVersion', async () => {
      jwtToken = await service.login(loginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      await service.logout(authPayload);

      const updatedUser = await prisma.user.findUnique({
        where: { id: user!.id },
      });
      expect(updatedUser?.tokenVersion).toBeNull();
    });

    it('should be idempotent if tokenVersion is already null', async () => {
      await prisma.user.update({
        where: {
          id: user!.id,
        },
        data: {
          tokenVersion: {
            set: null,
          },
        },
      });

      jwtToken = await service.login(loginInput);
      authPayload = await jwtService.verifyAsync(jwtToken);

      await expect(service.logout(authPayload)).resolves.toBeUndefined();
    });
  });

  describe('sendRecoverEmail()', () => {
    it('should send recovery email with token', async () => {
      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockResolvedValueOnce({} as any);

      await service.sendRecoverEmail(user!.email);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user!.email,
          subject: 'Welcome!',
          template: 'welcome',
          context: expect.objectContaining({
            token: expect.any(String),
          }),
          text: expect.stringContaining('This is your recuperation token'),
        }),
      );

      spy.mockRestore();
    });

    it('should throw if user not found', async () => {
      await expect(
        service.sendRecoverEmail('unknown@mail.com'),
      ).rejects.toThrow(PrismaClientKnownRequestError);
    });

    it('should throw if sending mail fails', async () => {
      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValueOnce(new Error('Mail failed'));

      await expect(service.sendRecoverEmail(user!.email)).rejects.toThrow(
        'Mail failed',
      );

      spy.mockRestore();
    });
  });

  describe('updatePassword()', () => {
    it('should update password if token is valid', async () => {
      const token = await jwtService.signAsync(
        { sub: user!.id },
        { expiresIn: '15m' },
      );
      resetPasswordInput.token = token;

      const result = await service.updatePassword(resetPasswordInput);
      expect(result).toBe(true);

      const updated = await prisma.user.findUnique({ where: { id: user!.id } });
      const match = await bcrypt.compare(
        resetPasswordInput.newPassword,
        updated!.passwordHash,
      );
      expect(match).toBe(true);
    });

    it('should throw if token is invalid', async () => {
      resetPasswordInput.token = uuidv4();

      await expect(service.updatePassword(resetPasswordInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
