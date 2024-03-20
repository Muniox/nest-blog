import { HttpStatus } from '@nestjs/common';

export const registerCreatedResponse = {
  description: 'Successful response after valid registration',
  schema: {
    type: 'object',
    properties: {
      message: {
        example: 'User was registered',
        type: 'string',
      },
      statusCode: {
        example: HttpStatus.CREATED,
        type: 'number',
      },
    },
  },
};

export const registerConfilctResponse = {
  description:
    'Conflict error after try to register User that have email or username taken',
  // schema: {
  //   type: 'object',
  //   properties: {
  //     message: {
  //       default: 'User with that email already exists',
  //       type: 'string',
  //     },
  //     error: {
  //       type: 'string',
  //       default: 'Conflict',
  //     },
  //     statusCode: {
  //       default: HttpStatus.CONFLICT,
  //       type: 'number',
  //     },
  //   },
  // },
};
