import { Injectable } from '@nestjs/common';

import { UserRoleEntity } from '../entities';
import { Role } from '../../types';
import { UserRoleRepository } from '../repositories';

@Injectable()
export class AddRoleService {
  constructor(private userRoleRepository: UserRoleRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.createUserRoles(Object.values(Role));
  }

  async createUserRoles(roles: string[]): Promise<void> {
    // pozbywam się z tablicy wszystkich duplikatów
    const uniqueRoleArray: string[] = [...new Set(roles)];

    uniqueRoleArray.map(async (item: string): Promise<void> => {
      const searchRoleType: UserRoleEntity[] =
        await this.userRoleRepository.findByRoleType(item);
      if (searchRoleType.length === 0) {
        const role: UserRoleEntity = new UserRoleEntity();
        role.roleType = item;
        await this.userRoleRepository.save(role);
      }
    });
  }
}
