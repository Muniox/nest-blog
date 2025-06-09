import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleEntity } from '../entities';
import { UserRoleRepositoryInterface } from '../interfaces';

@Injectable()
export class UserRoleRepository
  extends Repository<UserRoleEntity>
  implements UserRoleRepositoryInterface
{
  constructor(
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) {
    super(
      userRoleRepository.target,
      userRoleRepository.manager,
      userRoleRepository.queryRunner,
    );
  }

  async findByRoleType(item: string) {
    return await this.findBy({
      roleType: item,
    });
  }

  async findUserRoleWithRoleTypeUser() {
    return await this.userRoleRepository.findOne({
      where: { roleType: 'user' },
    });
  }
}
