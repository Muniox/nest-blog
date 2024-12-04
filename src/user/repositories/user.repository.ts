import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { UserEntity } from '../entities';
import { IUserRepository } from '../interfaces';
import {
  ValidationRequestCreateUserDto,
  ValidationRequestUpdateUserDto,
} from '../dtos';

@Injectable()
export class UserRepository
  extends Repository<UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }
  async updateUserHashRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.userRepository.update({ id }, { hashedRefreshToken });
  }

  async findOneUserByEmailWithRole(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async deleteUser(item: UserEntity) {
    await this.userRepository.remove([item]);
  }

  async findOneUserByEmailOrUsernameWhereNotIdWithRole(
    item: ValidationRequestUpdateUserDto,
    id: string,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: [
        { email: item.email, id: Not(id) },
        { username: item.username, id: Not(id) },
      ],
      relations: { role: true },
    });
  }

  async createOrUpdateUser(item: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(item);
  }

  async deleteHashedRefreshToken(id: string): Promise<void> {
    await this.userRepository.update(
      { id, hashedRefreshToken: Not(IsNull()) },
      { hashedRefreshToken: null },
    );
  }

  async findOneUserWithRole(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async findAllUsersWithRole(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      relations: { role: true },
    });
  }

  async findOneUserByEmailOrUsername(
    item: ValidationRequestCreateUserDto | ValidationRequestUpdateUserDto,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: [{ email: item.email }, { username: item.username }],
    });
  }
}
