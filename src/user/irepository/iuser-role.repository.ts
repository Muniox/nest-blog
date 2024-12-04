import { Injectable } from '@nestjs/common';

import { UserRoleEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export abstract class IUserRoleRepository extends Repository<UserRoleEntity> {
  abstract findByRoleType(item: string): Promise<UserRoleEntity[]>;
}
