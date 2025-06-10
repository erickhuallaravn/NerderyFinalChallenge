import { Module } from '@nestjs/common';
import { RoleSeeder } from './roles/role.seed';
import { UserSeeder } from './users/user.seed';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';
import { ProductSeeder } from './products/product.seed';
import { ProductVariationSeeder } from './products/product-variation.seed';
import { ProductModule } from 'src/products/products.module';

@Module({
  providers: [RoleSeeder, UserSeeder, ProductSeeder, ProductVariationSeeder],
  exports: [RoleSeeder, UserSeeder, ProductSeeder, ProductVariationSeeder],
  imports: [CustomerModule, UserModule, ProductModule],
})
export class SeederModule {}
