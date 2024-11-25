import { AutoMap } from '@automapper/classes';
import { PostResponse, Role } from 'src/types';

export class AutomapperReadPostDto implements PostResponse {
  @AutoMap()
  id: string;

  @AutoMap()
  title: string;

  @AutoMap()
  description: string;

  @AutoMap()
  img: string;

  createdAt: Date;

  updatedAt: Date;

  @AutoMap()
  category: string;

  @AutoMap()
  username: string;

  @AutoMap()
  role: Role;
}
