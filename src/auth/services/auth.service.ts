import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { LogInInput } from '../dtos/requests/login/login.input';
import { SignUpInput } from '../dtos/requests/signup/signup.input';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '../types/jwt-payload.type';
import { User } from 'generated/prisma';

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
      customerId: customer!.id,
      userType: 'CUSTOMER',
      tokenVersion: tokenVersion!,
    };
    return this.jwtService.signAsync(payload);
  }

  async registerCustomer(customerInfo: SignUpInput): Promise<string> {
    const { customer, tokenVersion } =
      await this.customerService.create(customerInfo);
    const user = await this.prisma.user.findUnique({
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
    if (!user) {
      throw new InternalServerErrorException(
        'The server could not create the user, try again',
      );
    }
    const payload: JwtPayload = {
      sub: customer.userId,
      customerId: customer.id,
      userType: 'CUSTOMER',
      tokenVersion: tokenVersion,
    };
    return this.jwtService.signAsync(payload);
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { set: null },
      },
    });
  }

  async sendRecoverEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new NotFoundException('El usuario no se encuentra registrado.');

    const token = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '15m' },
    );
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperación de contraseña',
      text: `Tu token de recuperación: ${token}`,
    });
  }

  async updatePassword(token: string, newPassword: string): Promise<boolean> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return await this.userService.updatePassword(newPassword, payload);
  }
}
