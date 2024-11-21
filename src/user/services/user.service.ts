import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import {
  UpdateUserDto,
  AutomapperReadUserDto,
  AutomapperUpdateUserDto,
} from '../dto';
import { UserEntity } from '../entities';
import { hashData } from '../../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectMapper() private readonly automapper: Mapper,
  ) {}

  async findOneUserMapped(id: string): Promise<AutomapperReadUserDto> {
    return this.automapper.mapAsync(
      await this.userRepository.findOne({
        where: { id },
        relations: { role: true },
      }),
      UserEntity,
      AutomapperReadUserDto,
    );
  }

  async findOneUser(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async updateUserMapped(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    const checkUser: UserEntity = await this.findUserByEmailOrUsername(
      updateUserDto.email,
      updateUserDto.username,
    );

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
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!user)
      throw new ForbiddenException(
        "User have no access to this resource or resources don't exist",
      );

    await this.userRepository.remove([user]);
  }

  async updateUserHashRT(id: string, hashRT: string): Promise<void> {
    await this.userRepository.update({ id }, { hashedRT: hashRT });
  }

  // jeśli to zmienisz zmienisz również walidaję! w local stretegy
  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async findUserByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: [{ email }, { username }],
      relations: { role: true },
    });
  }
}
