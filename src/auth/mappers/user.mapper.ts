import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities';
import { ReadUserDto } from '../dto/read-user.dto';

@Injectable()
export class UserMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        UserEntity,
        ReadUserDto,
        forMember(
          (destination) => destination.role,
          mapFrom((source) => source.role.roleType),
        ),
      );
    };
  }
}
