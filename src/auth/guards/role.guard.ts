import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role, UserTokenRequest } from '../../types';
import { ROLES_KEY } from '../decorators';
import { UserService } from '../../user/services';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: UserTokenRequest } = context
      .switchToHttp()
      .getRequest();
    const getUserWithRole = await this.userService.findOneUser(user.sub);
    return requiredRoles.some((role) =>
      getUserWithRole.role.roleType.includes(role),
    );
  }
}
