import { Module } from '@nestjs/common';
import { RoleSeeder } from './roles/role.seed';
import { UserSeeder } from './users/user.seed';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';
import { ProductSeeder } from './products/product.seed';
import { ProductVariationSeeder } from './products/product-variation.seed';
import { ProductModule } from 'src/products/products.module';
import { PromotionalDiscountSeeder } from './promotional-discounts/promotional-discounts.seed';
import { OptionValueSeeder } from './option-value/option-value.seeder';

@Module({
  providers: [
    RoleSeeder,
    UserSeeder,
    OptionValueSeeder,
    ProductSeeder,
    ProductVariationSeeder,
    PromotionalDiscountSeeder,
  ],
  exports: [
    RoleSeeder,
    UserSeeder,
    OptionValueSeeder,
    ProductSeeder,
    ProductVariationSeeder,
    PromotionalDiscountSeeder,
  ],
  imports: [CustomerModule, UserModule, ProductModule],
})
export class SeederModule {}
