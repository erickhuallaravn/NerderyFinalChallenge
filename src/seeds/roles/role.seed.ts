import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    await this.prisma.role.upsert({
      where: {
        name: 'STANDAR_CUSTOMER_ROLE',
      },
      create: {
        name: 'STANDAR_CUSTOMER_ROLE',
        description: 'Standard role for customer',
      },
      update: {},
    });
    await this.prisma.role.upsert({
      where: {
        name: 'STANDAR_MANAGER_ROLE',
      },
      create: {
        name: 'STANDAR_MANAGER_ROLE',
        description: 'Standard role for manager',
      },
      update: {},
    });
  }
}
