import { AutoMap } from '@automapper/classes';
import { PostResponse } from '../../types';

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
  user: {
    username: string;
    role: string;
  };
}
