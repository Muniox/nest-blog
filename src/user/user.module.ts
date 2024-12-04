import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService, AdminPanelUserService, AddRoleService } from './services';
import { UserController, AdminPanelUserController } from './controllers';
import { UserEntity, UserRoleEntity } from './entities';
import { UserMapper } from './mappers';
import { UserRepository, UserRoleRepository } from './repositories';
import { IUserRoleRepository } from './irepository';

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
      provide: IUserRoleRepository,
      useClass: UserRoleRepository,
    },
  ],
  exports: [UserService, AdminPanelUserService],
})
export class UserModule {}
