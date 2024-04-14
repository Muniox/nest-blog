import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@email.com',
  })
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({
    description: 'User username',
    example: 'Test',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  @MinLength(4)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'Testowy@1',
  })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @MaxLength(16)
  password: string;
}
