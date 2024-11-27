import { AutoMap } from '@automapper/classes';
import { AutomapperCreatePostDto } from './automapper-create-post.dto';

export class AutomapperUpdatePostDto extends AutomapperCreatePostDto {
  @AutoMap()
  id: string;
}
