import { ApiProperty, PartialType } from '@nestjs/swagger';

import { ValidationCreatePostDto } from './validation-create-post.dto';
import { IsString } from 'class-validator';

export class ValidationUpdatePostDto extends PartialType(
  ValidationCreatePostDto,
) {
  @ApiProperty({
    description: 'Post title',
    example: 'Post Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Post html description',
    example: '<p>description paragraph</p>',
  })
  @IsString()
  description: string;
}
