import { Module } from '@nestjs/common';
import { OrderHeaderService } from './services/order-header/order-header.service';
import { OrderItemService } from './services/order-item/order-item.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderItemResolver } from './resolvers/order-item/order-item.resolver';
import { OrderHeaderResolver } from './resolvers/order-header/order-header.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    OrderHeaderResolver,
    OrderHeaderService,
    OrderItemService,
    OrderItemResolver,
  ],
})
export class OrderModule {}
