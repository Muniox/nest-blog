import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { UserRoleEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRoleRepository } from '../irepository/iuser-role.repository';

@Injectable()
export class UserRoleRepository
  extends Repository<UserRoleEntity>
  implements IUserRoleRepository
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
}
