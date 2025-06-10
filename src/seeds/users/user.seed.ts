import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerSignUpInput } from 'src/auth/dtos/requests/signup/customerSignup.input';
import { ManagerSignUpInput } from 'src/auth/dtos/requests/signup/managerSignup.input';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PASSWORD_ENCRYPT_ROUNDS } from 'src/common/constants/app.constants';
import { RowStatus, UserType } from '@prisma/client';

@Injectable()
export class UserSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const managerRole = await this.prisma.role.findFirstOrThrow({
      where: { name: 'STANDARD_MANAGER_ROLE' },
    });

    const customerRole = await this.prisma.role.findFirstOrThrow({
      where: { name: 'STANDARD_CUSTOMER_ROLE' },
    });

    const customerPassword = 'customerPassword';
    const managerPassword = 'managerPassword';

    const customerRegisterInfo: CustomerSignUpInput = {
      firstName: 'Default',
      lastName: 'Customer',
      email: 'default_customer@test.com',
      password: customerPassword,
    };

    const managerRegisterInfo: ManagerSignUpInput = {
      firstName: 'Default',
      lastName: 'Manager',
      email: 'default_manager@test.com',
      password: managerPassword,
    };

    const customerTokenVersion = uuidv4();
    const customerPasswordHash = await bcrypt.hash(
      customerRegisterInfo.password,
      PASSWORD_ENCRYPT_ROUNDS,
    );
    const customerUser = await this.prisma.user.upsert({
      where: { email: customerRegisterInfo.email },
      create: {
        email: customerRegisterInfo.email,
        passwordHash: customerPasswordHash,
        userType: UserType.CUSTOMER,
        tokenVersion: customerTokenVersion,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
      update: {
        passwordHash: customerPasswordHash,
        tokenVersion: customerTokenVersion,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });

    await this.prisma.userRoles.upsert({
      where: {
        userId_roleId: {
          userId: customerUser.id,
          roleId: customerRole.id,
        },
      },
      create: {
        userId: customerUser.id,
        roleId: customerRole.id,
        validUntil: null,
      },
      update: {},
    });

    await this.prisma.customer.upsert({
      where: {
        userId: customerUser.id,
      },
      create: {
        userId: customerUser.id,
        firstName: customerRegisterInfo.firstName,
        lastName: customerRegisterInfo.lastName,
        address: customerRegisterInfo.address ?? null,
        phoneNumber: customerRegisterInfo.phoneNumber ?? null,
        birthday: customerRegisterInfo.birthday
          ? new Date(customerRegisterInfo.birthday)
          : null,
      },
      update: {
        firstName: customerRegisterInfo.firstName,
        lastName: customerRegisterInfo.lastName,
        address: customerRegisterInfo.address ?? null,
        phoneNumber: customerRegisterInfo.phoneNumber ?? null,
        birthday: customerRegisterInfo.birthday
          ? new Date(customerRegisterInfo.birthday)
          : null,
      },
    });

    const managerTokenVersion = uuidv4();
    const managerPasswordHash = await bcrypt.hash(
      managerRegisterInfo.password,
      PASSWORD_ENCRYPT_ROUNDS,
    );
    const managerUser = await this.prisma.user.upsert({
      where: { email: managerRegisterInfo.email },
      create: {
        email: managerRegisterInfo.email,
        passwordHash: managerPasswordHash,
        userType: UserType.MANAGER,
        tokenVersion: managerTokenVersion,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
      update: {
        passwordHash: managerPasswordHash,
        tokenVersion: managerTokenVersion,
        status: RowStatus.ACTIVE,
        statusUpdatedAt: new Date(),
      },
    });

    await this.prisma.userRoles.upsert({
      where: {
        userId_roleId: {
          userId: managerUser.id,
          roleId: managerRole.id,
        },
      },
      create: {
        userId: managerUser.id,
        roleId: managerRole.id,
        validUntil: null,
      },
      update: {},
    });
  }
}
