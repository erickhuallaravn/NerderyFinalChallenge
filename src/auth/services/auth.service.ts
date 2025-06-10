import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { JwtService } from '@nestjs/jwt';
import { LogInInput } from '../dtos/requests/login/login.input';
import { CustomerSignUpInput } from '../dtos/requests/signup/customerSignup.input';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '../types/jwt-payload.type';
import { User, UserType } from '@prisma/client';
import { ManagerSignUpInput } from '../dtos/requests/signup/managerSignup.input';
import { ResetPasswordInput } from '../dtos/requests/resetPassword/resetPassword.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async login(authCredentials: LogInInput): Promise<string> {
    const { email, password } = authCredentials;
    const user: User = await this.userService.findByCredentials({
      email,
      password,
    });
    let tokenVersion: string | null = user.tokenVersion;
    if (user.tokenVersion === null) {
      tokenVersion = uuidv4();
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          tokenVersion: { set: tokenVersion },
        },
      });
    }
    const userId = user.id;
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    const payload: JwtPayload = {
      sub: user.id,
      customerId: customer?.id,
      userType: user.userType,
      tokenVersion: tokenVersion!,
    };
    return this.jwtService.signAsync(payload);
  }

  async registerCustomer(customerInfo: CustomerSignUpInput): Promise<string> {
    const customer = await this.customerService.create(customerInfo);
    await this.prisma.user.findUniqueOrThrow({
      where: { id: customer.userId },
      include: {
        userRoles: {
          select: {
            role: {
              select: {
                name: true,
                permissions: true,
              },
            },
          },
        },
      },
    });
    const payload: JwtPayload = {
      sub: customer.userId,
      customerId: customer.id,
      userType: UserType.CUSTOMER,
      tokenVersion: customer.user.tokenVersion!,
    };
    return this.jwtService.signAsync(payload);
  }

  async registerManager(
    managerInfo: ManagerSignUpInput,
    authPayload: JwtPayload,
  ): Promise<string> {
    const manager = await this.userService.createManager(managerInfo);
    const payload: JwtPayload = {
      sub: authPayload.sub,
      customerId: null,
      userType: authPayload.userType,
      tokenVersion: manager.tokenVersion!,
    };
    return this.jwtService.signAsync(payload);
  }

  async logout(authPayload: JwtPayload): Promise<void> {
    await this.prisma.user.update({
      where: { id: authPayload.sub },
      data: {
        tokenVersion: { set: null },
      },
    });
  }

  async sendRecoverEmail(email: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { email } });

    const token = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '15m' },
    );
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome!',
      context: { token: token },
      text: `This is your recuperation token: ${token}`,
    });
  }

  async updatePassword(input: ResetPasswordInput): Promise<boolean> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(input.token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return await this.userService.updatePassword(input.newPassword, payload);
  }
}
