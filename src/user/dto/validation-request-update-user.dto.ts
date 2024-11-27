import { PartialType } from '@nestjs/swagger';

import { ValidationRequestCreateUserDto } from './validation-request-create-user.dto';

export class ValidationRequestUpdateUserDto extends PartialType(
  ValidationRequestCreateUserDto,
) {}
