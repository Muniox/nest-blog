import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  UserTokenRequest,
  UserATRequestData,
  UserRTRequestData,
} from '../../types';

export const User = createParamDecorator(
  (data: UserATRequestData | UserRTRequestData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserTokenRequest = request.user;

    return data ? user?.[data] : user;
  },
);
