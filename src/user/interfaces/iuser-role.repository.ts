import { UserRoleEntity } from '../entities';
import { Repository } from 'typeorm';

export const USER_ROLE_REPOSITORY_TOKEN = 'USER_ROLE_REPOSITORY_TOKEN';

export interface IUserRoleRepository extends Repository<UserRoleEntity> {
  findByRoleType(item: string): Promise<UserRoleEntity[]>;
  findUserRoleWithRoleTypeUser(): Promise<UserRoleEntity>;
}
