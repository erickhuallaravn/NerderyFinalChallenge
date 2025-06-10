import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    await this.prisma.role.upsert({
      where: {
        name: 'STANDARD_CUSTOMER_ROLE',
      },
      create: {
        name: 'STANDARD_CUSTOMER_ROLE',
        description: 'Standard role for customer',
      },
      update: {},
    });
    await this.prisma.role.upsert({
      where: {
        name: 'STANDARD_MANAGER_ROLE',
      },
      create: {
        name: 'STANDARD_MANAGER_ROLE',
        description: 'Standard role for manager',
      },
      update: {},
    });
  }
}
