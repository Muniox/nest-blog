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
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
    {
      message:
        'Password Must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character (!,@,#,$,%,^,&,*). Minimum 6 characters, maximum 16 characters.',
    },
  )
  password: string;
}
