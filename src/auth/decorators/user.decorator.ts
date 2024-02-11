import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  UserTokenRequest,
  UserATRequestData,
  UserRTRequestData,
} from '../../types';
import { UserEntity } from '../../user/entities';

export const User = createParamDecorator(
  (
    data: UserATRequestData | UserRTRequestData,
    ctx: ExecutionContext,
  ): string | number | UserTokenRequest => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserTokenRequest | UserEntity = request.user;

    return data ? user?.[data] : user;
  },
);
