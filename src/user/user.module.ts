import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService, AdminPanelUserService, AddRoleService } from './services';
import { UserController, AdminPanelUserController } from './controllers';
import { UserEntity, UserRoleEntity } from './entities';
import { UserMapper } from './mappers';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController, AdminPanelUserController],
  providers: [
    UserService,
    AdminPanelUserService,
    AddRoleService,
    UserMapper,
    UserRepository,
    UserRoleRepository,
  ],
  exports: [UserService, AdminPanelUserService],
})
export class UserModule {}
