import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService, AdminUserService, AddRoleService } from './services';
import { UserController, AdminUserController } from './controllers';
import { UserEntity, UserRoleEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController, AdminUserController],
  providers: [UserService, AdminUserService, AddRoleService],
  exports: [UserService, AdminUserService],
})
export class UserModule {}
