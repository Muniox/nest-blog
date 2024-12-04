import { ApiProperty } from '@nestjs/swagger';

export class ValidationRequestLoginDto {
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
