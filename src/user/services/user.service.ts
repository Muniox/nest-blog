import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserDto } from '../dto';
import { UserEntity } from '../entities';
import { hashData } from '../../utils';
import { MessageResponse } from '../../types';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AutomapperReadUserDto } from '../dto/automapper-read-user.dto';
import { AutomapperUpdateUserDto } from '../dto/automapper-update-user.dto';

// TODO: add username to user (needed for displaying who published post!)
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

  async removeUser(id: string): Promise<MessageResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    await this.userRepository.remove([user]);

    return {
      message: 'User was deleted',
      statusCode: HttpStatus.OK,
    };
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
