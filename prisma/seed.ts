import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RoleSeeder } from '../src/seeds/roles/role.seed';
import { UserSeeder } from 'src/seeds/users/user.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app.get(RoleSeeder).run();
  await app.get(UserSeeder).run();

  await app.close();
}

void bootstrap().then(() => {
  console.log('Seed function completed');
});
