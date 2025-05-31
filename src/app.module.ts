import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CustomerModule } from './customer/customer.module';
import { ShopCartsModule } from './shop-carts/shop-carts.module';
import { PromotionalDiscountsModule } from './discounts/promotional-discounts.module';
import { OrderModule } from './orders/orders.module';
import { PaymentController } from './payments/controllers/payments.controller';

void ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
      csrfPrevention: false,
    }),
    AuthModule,
    UserModule,
    CustomerModule,
    ProductModule,
    CloudinaryModule,
    ShopCartsModule,
    PromotionalDiscountsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
