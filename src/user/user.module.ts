import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService, AdminPanelUserService, AddRoleService } from './services';
import { UserController, AdminPanelUserController } from './controllers';
import { UserEntity, UserRoleEntity } from './entities';
import { UserMapper } from './mappers';
import { UserRepository, UserRoleRepository } from './repositories';
import {
  ADMIN_PANEL_SERVICE_TOKEN,
  USER_REPOSITORY_TOKEN,
  USER_ROLE_REPOSITORY_TOKEN,
  USER_SERVICE_TOKEN,
} from './interfaces';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController, AdminPanelUserController],
  providers: [
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService,
    },
    {
      provide: ADMIN_PANEL_SERVICE_TOKEN,
      useClass: AdminPanelUserService,
    },
    AddRoleService,
    UserMapper,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: USER_ROLE_REPOSITORY_TOKEN,
      useClass: UserRoleRepository,
    },
  ],
  exports: [
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService,
    },
    {
      provide: ADMIN_PANEL_SERVICE_TOKEN,
      useClass: AdminPanelUserService,
    },
  ],
})
export class UserModule {}
