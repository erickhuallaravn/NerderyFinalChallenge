import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { LogInInput } from '../dtos/requests/login/login.input';
import { SignUpInput } from '../dtos/requests/signup/signup.input';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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
    const user = await this.userService.findByCredentials({
      email,
      password,
    });
    let token_version: string | null = user.token_version;
    if (user.token_version === null) {
      token_version = uuidv4();
      await this.prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          token_version: { set: token_version },
        },
      });
    }
    const { user_id } = user;
    const payload = {
      sub: user_id,
      token_version: token_version,
    };
    return this.jwtService.signAsync(payload);
  }

  async registerCustomer(customerInfo: SignUpInput): Promise<string> {
    const { customer, token_version } =
      await this.customerService.create(customerInfo);
    const { user_id } = customer;
    const payload = {
      sub: user_id,
      token_version: token_version,
    };

    return this.jwtService.signAsync(payload);
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { user_id: userId },
      data: {
        token_version: { set: null },
      },
    });
  }

  async sendRecoverEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new NotFoundException('El usuario no se encuentra registrado.');

    const token = await this.jwtService.signAsync(
      { sub: user.user_id },
      { expiresIn: '15m' },
    );
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperación de contraseña',
      text: `Tu token de recuperación: ${token}`,
    });
  }

  async updatePassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { user_id: payload.sub },
      data: { password_hash: hashed },
    });
  }
}
