import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { MessageResponse } from '../../types';

export class ValidationResponseAuthMessageDto implements MessageResponse {
  @ApiProperty({
    description: 'message',
    example: 'example message',
  })
  message: string;
  @ApiProperty({
    description: 'Http status code',
    example: HttpStatus.OK,
  })
  statusCode: HttpStatus;

  constructor(messageResponse: { message: string; statusCode: HttpStatus }) {
    this.message = messageResponse.message;
    this.statusCode = messageResponse.statusCode;
  }
}
