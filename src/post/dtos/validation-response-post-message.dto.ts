import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from 'src/shared/types';

export class ValidationResponsePostMessageDto implements MessageResponse {
  message: string;
  statusCode: HttpStatus;
}
