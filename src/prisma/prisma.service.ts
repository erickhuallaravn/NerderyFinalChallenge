import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const nodeEnv = process.env.NODE_ENV || 'development';

    const dbUrls = {
      development: String(process.env.DATABASE_URL_DEVELOPMENT),
      test: String(process.env.DATABASE_URL_TEST),
      production: String(process.env.DATABASE_URL_PRODUCTION),
    };

    const databaseUrl: string = String(dbUrls[nodeEnv]);
    if (!databaseUrl) {
      throw new Error(`No database URL configured for NODE_ENV=${nodeEnv}`);
    }

    super({
      datasources: {
        db: { url: databaseUrl },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    return this.$transaction([
      this.userRoles.deleteMany(),
      this.customer.deleteMany(),
      this.user.deleteMany(),
      this.role.deleteMany(),
      this.productFile.deleteMany(),
      this.productVariation.deleteMany(),
      this.optionValue.deleteMany(),
      this.option.deleteMany(),
      this.product.deleteMany(),
      this.feature.deleteMany(),
    ]);
  }
}
