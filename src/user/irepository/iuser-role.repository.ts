import { UserRoleEntity } from '../entities';

export abstract class IUserRoleRepository {
  abstract findByRoleType(item: string): Promise<UserRoleEntity[]>;
}
