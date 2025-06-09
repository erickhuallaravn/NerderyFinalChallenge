import { Module } from '@nestjs/common';
import { RoleSeeder } from './roles/role.seed';
import { UserSeeder } from './users/user.seed';

@Module({
  providers: [RoleSeeder, UserSeeder],
  exports: [RoleSeeder, UserSeeder],
})
export class SeederModule {}
