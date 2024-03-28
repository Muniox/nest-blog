import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Testowy@1',
  })
  password: string;
}
