import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';

export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}
