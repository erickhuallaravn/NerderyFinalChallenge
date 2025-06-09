import { Injectable } from '@nestjs/common';
import { Role, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/services/user.service';
import { CustomerService } from '../../customer/services/customer.service';
import { CustomerSignUpInput } from 'src/auth/dtos/requests/signup/customerSignup.input';
import { ManagerSignUpInput } from 'src/auth/dtos/requests/signup/managerSignup.input';

@Injectable()
export class UserSeeder {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
  ) {}

  async run() {
    const managerRole: Role = await this.prisma.role.findFirstOrThrow({
      where: {
        name: 'STANDAR_MANAGER_ROLE',
      },
    });
    const { customerPassword, managerPassword } = {
      customerPassword: 'customerPassword',
      managerPassword: 'managerPassword',
    };
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
    
    const customerUser =
      await this.customerService.create(customerRegisterInfo);
    const managerUser =
      await this.userService.createManager(managerRegisterInfo);

    await this.prisma.userRoles.upsert({
      where: {
        userId_roleId: {
          userId: customerUser.id,
          roleId: managerRole.id,
        },
      },
      create: {
        userId: customerUser.id,
        roleId: managerRole.id,
      },
      update: {},
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
      },
      update: {},
    });
  }
}
