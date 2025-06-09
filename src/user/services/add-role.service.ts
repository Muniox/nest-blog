import { Inject, Injectable } from '@nestjs/common';

import { UserRoleEntity } from '../entities';
import { Role } from '../../shared/types';
import {
  UserRoleRepositoryInterface,
  USER_ROLE_REPOSITORY_TOKEN,
} from '../interfaces';

@Injectable()
export class AddRoleService {
  constructor(
    @Inject(USER_ROLE_REPOSITORY_TOKEN)
    private userRoleRepository: UserRoleRepositoryInterface,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.createUserRoles(Object.values(Role));
  }

  private async createUserRoles(roles: string[]): Promise<void> {
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
