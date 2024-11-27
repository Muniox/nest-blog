import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  UserTokenRequest,
  UserAaccessTokenRequestData,
  UserRefreshTokenRequestData,
} from '../../types';
import { UserEntity } from '../../user/entities';

export const User = createParamDecorator(
  (
    data: UserAaccessTokenRequestData | UserRefreshTokenRequestData,
    ctx: ExecutionContext,
  ): string | number | UserTokenRequest => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserTokenRequest | UserEntity = request.user;

    return data ? user?.[data] : user;
  },
);
