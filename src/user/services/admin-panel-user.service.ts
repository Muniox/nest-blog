import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import {
  ValidationRequestCreateUserDto,
  ValidationRequestUpdateUserDto,
  AutomapperCreateUserDto,
  AutomapperReadUserDto,
  AutomapperUpdateUserDto,
} from '../dto';
import { UserEntity, UserRoleEntity } from '../entities';
import { hashData } from '../../utils';
import { UserService } from './user.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class AdminPanelUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
    @InjectMapper() private readonly automapper: Mapper,
    private userService: UserService,
  ) {}

  async createUser(
    createUserDto: ValidationRequestCreateUserDto,
  ): Promise<AutomapperReadUserDto> {
    const checkUser: UserEntity = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
      relations: { role: true },
    });

    if (checkUser?.email === createUserDto.email) {
      throw new ConflictException('User with that email already exists');
    }

    if (checkUser?.username === createUserDto.username) {
      throw new ConflictException('User with that username already exists');
    }

    if (checkUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.automapper.mapAsync(
      {
        ...createUserDto,
        role: await this.userRoleRepository.findOne({
          where: { roleType: 'user' },
        }),
        hash: await hashData(createUserDto.password),
      },
      AutomapperCreateUserDto,
      UserEntity,
    );

    return await this.automapper.mapAsync(
      await this.userRepository.save(user),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async findOneUserMapped(id: string): Promise<AutomapperReadUserDto> {
    return this.userService.findOneUserMapped(id);
  }

  async findAllUsersMapped(): Promise<AutomapperReadUserDto[]> {
    return this.automapper.mapArrayAsync(
      await this.userRepository.find({
        relations: { role: true },
      }),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async updateUserMapped(
    id: string,
    updateUserDto: ValidationRequestUpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    const checkUser: UserEntity = await this.userRepository.findOne({
      where: [
        { email: updateUserDto.email },
        { username: updateUserDto.username },
      ],
      relations: { role: true },
    });

    if (checkUser?.email === updateUserDto.email) {
      throw new ConflictException(`User with this email already exist`);
    }

    if (checkUser?.username === updateUserDto.username) {
      throw new ConflictException(`User with this username already exist`);
    }

    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });

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
      await this.userRepository.save(newUser),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async removeUser(id: string): Promise<void> {
    return await this.userService.removeUser(id);
  }

  async logoutUser(id: string): Promise<void> {
    await this.userRepository.update(
      { id, hashedRT: Not(IsNull()) },
      { hashedRT: null },
    );
  }
}
