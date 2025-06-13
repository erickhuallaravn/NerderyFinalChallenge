import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RoleSeeder } from '../src/seeds/roles/role.seed';
import { UserSeeder } from '../src/seeds/users/user.seed';
import { ProductSeeder } from '../src/seeds/products/product.seed';
import { ProductVariationSeeder } from '../src/seeds/products/product-variation.seed';
import { PromotionalDiscountSeeder } from '../src/seeds/promotional-discounts/promotional-discounts.seed';
import { OptionValueSeeder } from 'src/seeds/option-value/option-value.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app.get(RoleSeeder).run();
  await app.get(UserSeeder).run();
  await app.get(OptionValueSeeder).run();
  await app.get(ProductSeeder).run();
  await app.get(ProductVariationSeeder).run();
  await app.get(PromotionalDiscountSeeder).run();

  await app.close();
}

void bootstrap().then(() => {
  console.log('Seed function completed');
});
