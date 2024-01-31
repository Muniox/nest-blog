import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, UserRoleEntity } from '../entities';
import { Role } from '../../types';

@Injectable()
export class AddRoleService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.createUserRoles(Object.values(Role));
  }

  async createUserRoles(roles: string[]): Promise<void> {
    // pozbywam się z tablicy wszystkich duplikatów
    const uniqueRoleArray = [...new Set(roles)];

    uniqueRoleArray.map(async (item: string): Promise<void> => {
      const searchRoleType = await this.userRoleRepository.findBy({
        roleType: item,
      });
      if (searchRoleType.length === 0) {
        const role: UserRoleEntity = new UserRoleEntity();
        role.roleType = item;
        await this.userRoleRepository.save(role);
      }
    });
  }
}
