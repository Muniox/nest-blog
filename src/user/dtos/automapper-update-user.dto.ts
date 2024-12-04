import { AutoMap } from '@automapper/classes';

import { AutomapperCreateUserDto } from './automapper-create-user.dto';

export class AutomapperUpdateUserDto extends AutomapperCreateUserDto {
  @AutoMap()
  id: string;
}
