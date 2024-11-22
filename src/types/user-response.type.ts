import { UserEntity } from '../user/entities';
import { Role } from './user-roles';

export type UserResponse = Pick<UserEntity, 'id' | 'email' | 'username'> & {
  role: Role;
};
