import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { UserEntity } from '../../user/entities';

export class AutomapperCreatePostDto {
  @AutoMap()
  @ApiProperty()
  img: string;

  @AutoMap()
  @ApiProperty({
    description: 'Post title',
    example: 'Post Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @AutoMap()
  @ApiProperty({
    description: 'Post html description',
    example: '<p>description paragraph</p>',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @AutoMap(() => UserEntity)
  user: UserEntity;

  @AutoMap()
  @ApiProperty({
    description: 'Post category',
    example: 'test',
  })
  @IsNotEmpty()
  @IsString()
  category: string;
}
