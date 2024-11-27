import { HttpStatus } from '@nestjs/common';

export type MessageResponse = {
  message: string;
  statusCode: HttpStatus;
};
