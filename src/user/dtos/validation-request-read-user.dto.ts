import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationRequestReadUserDto {
  @ApiProperty({
    description: 'UUID',
    format: 'uuid',
    example: '14698c02-2d72-4bd6-a8f5-e3fabfd662b7',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'user email',
    example: 'test@email.com',
  })
  @AutoMap()
  email: string;

  @ApiProperty({
    description: 'username',
    example: 'test9',
  })
  @AutoMap()
  username: string;

  @ApiProperty({
    description: 'user role',
    example: 'user',
  })
  @AutoMap()
  role: string;
}
