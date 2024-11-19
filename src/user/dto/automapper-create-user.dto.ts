import { AutoMap } from '@automapper/classes';

import { UserRoleEntity } from '../entities';

export class AutomapperCreateUserDto {
  @AutoMap()
  email: string;

  @AutoMap()
  username: string;

  @AutoMap()
  role: UserRoleEntity;

  @AutoMap()
  hash: string;
}
