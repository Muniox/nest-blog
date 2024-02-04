import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(64)
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @MaxLength(14)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/,
    {
      message:
        'Password Must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character (!,@,#,$,%,^,&,*). Minimum 8 characters, maximum 24 characters.',
    },
  )
  password: string;
}
