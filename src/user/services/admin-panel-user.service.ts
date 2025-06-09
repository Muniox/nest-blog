import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import {
  ValidationRequestCreateUserDto,
  ValidationRequestUpdateUserDto,
  AutomapperCreateUserDto,
  AutomapperReadUserDto,
  AutomapperUpdateUserDto,
} from '../dtos';
import { UserEntity } from '../entities';
import {
  AdminPanelUserServiceInterface,
  UserRepositoryInterface,
  UserRoleRepositoryInterface,
  UserServiceInterface,
  USER_REPOSITORY_TOKEN,
  USER_ROLE_REPOSITORY_TOKEN,
  USER_SERVICE_TOKEN,
} from '../interfaces';
import { HashService } from '../../shared/utils';

@Injectable()
export class AdminPanelUserService implements AdminPanelUserServiceInterface {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: UserRepositoryInterface,
    @Inject(USER_ROLE_REPOSITORY_TOKEN)
    private userRoleRepository: UserRoleRepositoryInterface,
    @InjectMapper() private readonly automapper: Mapper,
    @Inject(USER_SERVICE_TOKEN) private userService: UserServiceInterface,
    private hashService: HashService,
  ) {}

  async createUser(
    createUserDto: ValidationRequestCreateUserDto,
  ): Promise<AutomapperReadUserDto> {
    const checkUser: UserEntity =
      await this.userRepository.findOneUserByEmailOrUsername(createUserDto);

    if (checkUser?.email === createUserDto.email) {
      throw new ConflictException('User with that email already exists');
    }

    if (checkUser?.username === createUserDto.username) {
      throw new ConflictException('User with that username already exists');
    }

    const user = await this.automapper.mapAsync(
      {
        ...createUserDto,
        role: await this.userRoleRepository.findUserRoleWithRoleTypeUser(),
        hash: await this.hashService.hashData(createUserDto.password),
      },
      AutomapperCreateUserDto,
      UserEntity,
    );

    return await this.automapper.mapAsync(
      await this.userRepository.createOrUpdateUser(user),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async findOneUserMapped(id: string): Promise<AutomapperReadUserDto> {
    return this.userService.findOneUserMapped(id);
  }

  async findAllUsersMapped(): Promise<AutomapperReadUserDto[]> {
    return this.automapper.mapArrayAsync(
      await this.userRepository.findAllUsersWithRole(),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async updateUserMapped(
    id: string,
    updateUserDto: ValidationRequestUpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    const checkUser: UserEntity =
      await this.userRepository.findOneUserByEmailOrUsername(updateUserDto);

    // @TODO: Validacje można przenieść do entity jako funkcje
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
          ? await this.hashService.hashData(updateUserDto.password)
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
    return await this.userService.removeUser(id);
  }

  async logoutUser(id: string): Promise<void> {
    await this.userRepository.deleteHashedRefreshToken(id);
  }
}
