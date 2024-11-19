import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities';
import { ReadAuthUserDto } from '../dto/read-auth-user.dto';

@Injectable()
export class AuthMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile() {
    return (mapper) => {
      createMap(
        mapper,
        UserEntity,
        ReadAuthUserDto,
        forMember(
          (destination) => destination.role,
          mapFrom((source) => source.role.roleType),
        ),
      );
    };
  }
}
