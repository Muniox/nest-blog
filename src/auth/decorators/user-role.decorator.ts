import { SetMetadata } from '@nestjs/common';
import { Role } from '../../types';

export const ROLES_KEY = 'roles';
export const UseRole = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
