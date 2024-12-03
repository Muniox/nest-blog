import { Repository } from 'typeorm';
import { UserRoleEntity } from '../entities';

export class UserRoleRepository extends Repository<UserRoleEntity> {
  constructor(private dataSource) {
    super(UserRoleEntity, dataSource.createEntityManager());
  }
}
