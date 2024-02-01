import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserATRequest, UserATRequestData } from '../../types';

export const User = createParamDecorator(
  (data: UserATRequestData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserATRequest = request.user;

    return data ? user?.[data] : user;
  },
);
