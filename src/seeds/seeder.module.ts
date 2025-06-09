import { Module } from '@nestjs/common';
import { RoleSeeder } from './roles/role.seed';
import { UserSeeder } from './users/user.seed';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [RoleSeeder, UserSeeder],
  exports: [RoleSeeder, UserSeeder],
  imports: [CustomerModule, UserModule],
})
export class SeederModule {}
