import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, RowStatus, User, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LogInInput } from '../../auth/dtos/requests/login/login.input';
import { CustomerSignUpInput } from '../../auth/dtos/requests/signup/customerSignup.input';
import { ManagerSignUpInput } from 'src/auth/dtos/requests/signup/managerSignup.input';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { PASSWORD_ENCRYPT_ROUNDS } from 'src/common/constants/app.constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCredentials(userCredentials: LogInInput): Promise<User> {
    const { email, password } = userCredentials;
    const existingUser = await this.prisma.user.findUniqueOrThrow({
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

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'The provided credentials were incorrect.',
      );
    }
    return existingUser;
  }

  async createCustomer(customerInfo: CustomerSignUpInput): Promise<User> {
    const tokenVersion = uuidv4();

    const passwordHash = await bcrypt.hash(
      customerInfo.password,
      PASSWORD_ENCRYPT_ROUNDS,
    );
    const newUser = await this.prisma.user.create({
      data: {
        email: customerInfo.email,
        passwordHash: passwordHash,
        userType: UserType.CUSTOMER,
        tokenVersion: tokenVersion,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });

    const customerRole: Role = await this.prisma.role.findFirstOrThrow({
      where: { name: 'STANDARD_CUSTOMER_ROLE' },
    });

    await this.prisma.userRoles.create({
      data: {
        userId: newUser.id,
        roleId: customerRole.id,
        validUntil: null,
      },
    });

    return newUser;
  }

  async createManager(managerInfo: ManagerSignUpInput): Promise<User> {
    const tokenVersion = uuidv4();

    const passwordHash = await bcrypt.hash(
      managerInfo.password,
      PASSWORD_ENCRYPT_ROUNDS,
    );
    const newUser = await this.prisma.user.create({
      data: {
        email: managerInfo.email,
        passwordHash: passwordHash,
        userType: UserType.MANAGER,
        tokenVersion: tokenVersion,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });

    const customerRole: Role = await this.prisma.role.findFirstOrThrow({
      where: { name: 'STANDARD_MANAGER_ROLE' },
    });

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
