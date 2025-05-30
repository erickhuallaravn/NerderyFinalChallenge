import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShopCartService } from './services/shop-cart/shop-cart.service';
import { ShopCartResolver } from './resolvers/shop-cart/shop-cart.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ShopCartService, ShopCartResolver],
})
export class ShopCartsModule {}
