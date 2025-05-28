import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { user as User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { LogInInput } from '../auth/dtos/requests/login/login.input';
import { SignUpInput } from '../auth/dtos/requests/signup/signup.input';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCredentials(userCredentials: LogInInput): Promise<User> {
    const { email, password } = userCredentials;
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser || !existingUser.password_hash) {
      throw new NotFoundException('El usuario no se encuentra registrado.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Las credenciales proporcionadas son incorrectas.',
      );
    }

    return existingUser;
  }

  async create(params: { newUserInfo: SignUpInput }): Promise<User> {
    const { newUserInfo } = params;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: newUserInfo.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(newUserInfo.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: newUserInfo.email,
        password_hash: passwordHash,
        user_type: 'CUSTOMER',
        status: 'ACTIVE',
        status_updated_at: new Date(),
      },
    });

    const customerRole = await this.prisma.role.findFirst({
      where: { name: 'STANDARD_CUSTOMER' },
    });

    if (!customerRole) {
      throw new NotFoundException(
        'El rol STANDARD_CUSTOMER no está configurado en el sistema',
      );
    }

    await this.prisma.user_roles.create({
      data: {
        user_id: newUser.user_id,
        role_id: customerRole.role_id,
        valid_until: null,
      },
    });

    return newUser;
  }
}
