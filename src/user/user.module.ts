import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService, AdminPanelUserService, AddRoleService } from './services';
import { UserController, AdminPanelUserController } from './controllers';
import { UserEntity, UserRoleEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController, AdminPanelUserController],
  providers: [UserService, AdminPanelUserService, AddRoleService],
  exports: [UserService, AdminPanelUserService],
})
export class UserModule {}
