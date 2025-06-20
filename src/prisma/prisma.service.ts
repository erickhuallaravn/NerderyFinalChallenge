import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl: string = String(process.env.DATABASE_URL);
    if (!databaseUrl) {
      throw new Error(`No database URL configured in ENV`);
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
      this.role.deleteMany(),
      this.user.deleteMany(),
      this.userRoles.deleteMany(),
      this.product.deleteMany(),
      this.productFile.deleteMany(),
      this.option.deleteMany(),
      this.optionValue.deleteMany(),
      this.feature.deleteMany(),
      this.productVariation.deleteMany(),
      this.customer.deleteMany(),
      this.customerLikedProducts.deleteMany(),
      this.orderItemDiscount.deleteMany(),
      this.orderHeaderStatusHistory.deleteMany(),
      this.orderItem.deleteMany(),
      this.orderHeader.deleteMany(),
      this.orderPayment.deleteMany(),
      this.promotionalDiscount.deleteMany(),
      this.shopCartItem.deleteMany(),
      this.shopCartHeader.deleteMany(),
      this.shopCartItemDiscount.deleteMany(),
    ]);
  }
}
