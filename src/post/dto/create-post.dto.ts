import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  // TODO: make length validation
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
