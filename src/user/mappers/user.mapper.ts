import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entities';
import {
  AutomapperCreateUserDto,
  AutomapperReadUserDto,
  AutomapperUpdateUserDto,
} from '../dto';

@Injectable()
export class UserMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile() {
    return (mapper) => {
      createMap(mapper, AutomapperCreateUserDto, UserEntity);
      createMap(mapper, AutomapperUpdateUserDto, UserEntity);
      createMap(
        mapper,
        UserEntity,
        AutomapperReadUserDto,
        forMember(
          (destination) => destination.role,
          mapFrom((source) => source.role.roleType),
        ),
      );
    };
  }
}
