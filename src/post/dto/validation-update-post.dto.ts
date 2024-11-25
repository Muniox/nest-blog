import { PartialType } from '@nestjs/swagger';

import { ValidationCreatePostDto } from './validation-create-post.dto';

export class ValidationUpdatePostDto extends PartialType(
  ValidationCreatePostDto,
) {}
