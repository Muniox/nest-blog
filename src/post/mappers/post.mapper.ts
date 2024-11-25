import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AutomapperCreatePostDto } from '../dto/automapper-create-post.dto';
import { PostEntity } from '../entities';

@Injectable()
export class PostMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, AutomapperCreatePostDto, PostEntity);
    };
  }
}
