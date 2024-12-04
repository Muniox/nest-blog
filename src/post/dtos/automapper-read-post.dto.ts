import { AutoMap } from '@automapper/classes';
import { PostResponse, Role } from '../../types';
import { ApiProperty } from '@nestjs/swagger';

export class AutomapperReadPostDto implements PostResponse {
  @ApiProperty({
    description: 'UUID',
    format: 'uuid',
    example: 'e5d59d47-ce64-4240-94be-78a23868acc4',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'test title',
  })
  @AutoMap()
  title: string;

  @ApiProperty({
    description: 'Post description',
    example: 'test description',
  })
  @AutoMap()
  description: string;

  @ApiProperty({
    description: 'Post image name',
    example: '7a646efa-82d4-4128-9a53-bea4557a5a79.jpeg',
  })
  @AutoMap()
  img: string;

  @ApiProperty({
    description: 'Post created time',
    example: '2024-11-27T10:59:03.091Z',
  })
  @AutoMap()
  createdAt: Date;

  @ApiProperty({
    description: 'Post updated time',
    example: '2024-11-27T10:59:03.091Z',
  })
  @AutoMap()
  updatedAt: Date;

  @ApiProperty({
    description: 'Post category',
    example: 'test',
  })
  @AutoMap()
  category: string;

  @ApiProperty({
    description: 'Post author',
    example: { username: 'Test', role: Role.admin },
  })
  @AutoMap()
  user: {
    username: string;
    role: string;
  };
}
