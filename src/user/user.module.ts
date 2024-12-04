import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService, AdminPanelUserService, AddRoleService } from './services';
import { UserController, AdminPanelUserController } from './controllers';
import { UserEntity, UserRoleEntity } from './entities';
import { UserMapper } from './mappers';
import { UserRepository, UserRoleRepository } from './repositories';
import { USER_ROLE_REPOSITORY_TOKEN } from './irepository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController, AdminPanelUserController],
  providers: [
    UserService,
    AdminPanelUserService,
    AddRoleService,
    UserMapper,
    UserRepository,
    {
      provide: USER_ROLE_REPOSITORY_TOKEN,
      useClass: UserRoleRepository,
    },
  ],
  exports: [UserService, AdminPanelUserService],
})
export class UserModule {}
