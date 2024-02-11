import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  // TODO: make length validation
  @ApiProperty({
    description: 'Post title',
    example: 'Post Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Post html description',
    example: '<p>description paragraph</p>',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Post category',
    example: 'test',
  })
  @IsNotEmpty()
  @IsString()
  category: string;
}
