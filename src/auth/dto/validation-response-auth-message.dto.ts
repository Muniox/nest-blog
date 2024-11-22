import { HttpStatus } from '@nestjs/common';
import { MessageResponse } from '../../types';

export class ValidationResponseAuthMessageDto implements MessageResponse {
  message: string;
  statusCode: HttpStatus;

  constructor(messageResponse: { message: string; statusCode: HttpStatus }) {
    this.message = messageResponse.message;
    this.statusCode = messageResponse.statusCode;
  }
}
