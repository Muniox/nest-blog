import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role, UserTokenRequest } from '../../types';
import { ROLES_KEY } from '../decorators';
import { UserService } from '../../user/services';
import { UserEntity } from '../../user/entities';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if (!requiredRoles) {
    //   return true;
    // }

    // const { user }: { user: UserTokenRequest } = context
    //   .switchToHttp()
    //   .getRequest();
    // const getUserWithRole: UserEntity = await this.userService.findOneUser(
    //   user.sub,
    // );
    // return requiredRoles.some((role: Role) =>
    //   getUserWithRole.role.roleType.includes(role),
    // );

    if (!requiredRoles) {
      return from([true]);
    }

    const { user }: { user: UserTokenRequest } = context
      .switchToHttp()
      .getRequest();

    return from(this.userService.findOneUser(user.sub)).pipe(
      map((getUserWithRole: UserEntity) =>
        requiredRoles.some((role: Role) =>
          getUserWithRole.role.roleType.includes(role),
        ),
      ),
    );
  }
}
