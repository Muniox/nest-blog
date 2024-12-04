import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AutomapperCreatePostDto } from '../dtos/automapper-create-post.dto';
import { PostEntity } from '../entities';
import { AutomapperReadPostDto } from '../dtos';
import { AutomapperUpdatePostDto } from '../dtos/automapper-update-post.dto';

@Injectable()
export class PostMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, AutomapperCreatePostDto, PostEntity);
      createMap(mapper, AutomapperUpdatePostDto, PostEntity);
      createMap(
        mapper,
        PostEntity,
        AutomapperReadPostDto,
        forMember(
          (destination) => destination.user.username,
          mapFrom((source) => source.user.username),
        ),
        forMember(
          (destination) => destination.user.role,
          mapFrom((source) => source.user.role.roleType),
        ),
      );
    };
  }
}
