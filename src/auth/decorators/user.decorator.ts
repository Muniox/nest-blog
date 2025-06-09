import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  UserTokenRequest,
  UserAccessTokenRequestData,
  UserRefreshTokenRequestData,
} from '../../shared/types';
import { UserEntity } from '../../user/entities';

export const User = createParamDecorator(
  (
    data: UserAccessTokenRequestData | UserRefreshTokenRequestData,
    ctx: ExecutionContext,
  ): string | number | UserTokenRequest => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserTokenRequest | UserEntity = request.user;

    return data ? user?.[data] : user;
  },
);
