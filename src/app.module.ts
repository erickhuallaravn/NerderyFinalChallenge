import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CustomerModule } from './customer/customer.module';
import { ShopCartsModule } from './shop-carts/shop-carts.module';
import { PromotionalDiscountsModule } from './discounts/promotional-discounts.module';
import { OrderModule } from './orders/orders.module';
import { StripeModule } from './stripe/stripe.module';
import { SeederModule } from './seeds/seeder.module';

import { envSchema } from './config/env.validation';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000, //10 seconds
        limit: 10,
      },
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, any>) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error('Invalid environment variables');
        }
        return result.data;
      },
    }),

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
    StripeModule,
    SeederModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
