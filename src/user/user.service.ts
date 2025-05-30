import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { LogInInput } from '../auth/dtos/requests/login/login.input';
import { SignUpInput } from '../auth/dtos/requests/signup/signup.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

const PASSWORD_ENCRYPT_ROUNDS: number = 10;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCredentials(userCredentials: LogInInput): Promise<User> {
    const { email, password } = userCredentials;
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
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

    if (!existingUser || !existingUser.passwordHash) {
      throw new NotFoundException('El usuario no se encuentra registrado.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.passwordHash,
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

    const passwordHash = await bcrypt.hash(
      newUserInfo.password,
      PASSWORD_ENCRYPT_ROUNDS,
    );
    const newUser = await this.prisma.user.create({
      data: {
        email: newUserInfo.email,
        passwordHash: passwordHash,
        userType: 'CUSTOMER',
        status: 'ACTIVE',
        statusUpdatedAt: new Date(),
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

    await this.prisma.userRoles.create({
      data: {
        userId: newUser.id,
        roleId: customerRole.id,
        validUntil: null,
      },
    });

    return newUser;
  }

  async updatePassword(
    newPassword: string,
    payload: JwtPayload,
  ): Promise<boolean> {
    const hashed = await bcrypt.hash(newPassword, PASSWORD_ENCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash: hashed },
    });
    return true;
  }
}
