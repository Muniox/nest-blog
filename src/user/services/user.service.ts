import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import {
  ValidationRequestUpdateUserDto,
  AutomapperReadUserDto,
  AutomapperUpdateUserDto,
} from '../dto';
import { UserEntity } from '../entities';
import { hashData } from '../../utils';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: IUserRepository,
    @InjectMapper() private readonly automapper: Mapper,
  ) {}

  async findOneUserMapped(id: string): Promise<AutomapperReadUserDto> {
    return this.automapper.mapAsync(
      await this.userRepository.findOneUserWithRole(id),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async findOneUser(id: string): Promise<UserEntity> {
    return this.userRepository.findOneUserWithRole(id);
  }

  async updateUserMapped(
    id: string,
    updateUserDto: ValidationRequestUpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    const checkUser: UserEntity =
      await this.userRepository.findOneUserByEmailOrUsernameWhereNotIdWithRole(
        updateUserDto,
        id,
      );

    if (checkUser?.email === updateUserDto.email) {
      throw new ConflictException(`User with this email already exist`);
    }

    if (checkUser?.username === updateUserDto.username) {
      throw new ConflictException(`User with this username already exist`);
    }

    const user: UserEntity = await this.userRepository.findOneUserWithRole(id);

    const newUser = await this.automapper.mapAsync(
      {
        ...user,
        email: updateUserDto.email,
        username: updateUserDto.username,
        hash: updateUserDto.password
          ? await hashData(updateUserDto.password)
          : user.hash,
      },
      AutomapperUpdateUserDto,
      UserEntity,
    );

    return this.automapper.mapAsync(
      await this.userRepository.createOrUpdateUser(newUser),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneUserWithRole(id);

    if (!user)
      throw new ForbiddenException(
        "User have no access to this resource or resources don't exist",
      );

    await this.userRepository.deleteUser(user);
  }

  async updateUserHashRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.userRepository.updateUserHashRefreshToken(
      id,
      hashedRefreshToken,
    );
  }

  // jeśli to zmienisz zmienisz również walidaję! w local stretegy
  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneUserByEmailWithRole(email);
  }
}
