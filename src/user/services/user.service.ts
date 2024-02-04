import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateUserDto } from '../dto';
import { UserEntity } from '../entities';
import { hashData } from '../../utils';
import { MessageResponse, UserResponse } from '../../types';

// TODO: add username to user (needed for displaying who published post!)
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  filter(user: UserEntity): UserResponse {
    if (!user) throw new ForbiddenException("User don't exist");

    const { id, email, role, username }: UserResponse = user;

    return {
      id,
      username,
      email,
      role,
    };
  }

  async findOneUser(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async updateUserFiltered(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user: UserEntity = await this.findOneUser(id);

    if (user.email === updateUserDto.email) {
      throw new ConflictException(`User with this email already exist`);
    }

    if (user.username === updateUserDto.username) {
      throw new ConflictException(`User with this username already exist`);
    }

    await this.userRepository.update(
      { id },
      {
        email: updateUserDto.email,
        username: updateUserDto.username,
        hash: updateUserDto.password
          ? await hashData(updateUserDto.password)
          : user.hash,
      },
    );

    const updatedUser: UserEntity = await this.findOneUser(id);

    if (!updatedUser) {
      throw new ForbiddenException(`User with this id don't exist`);
    }

    return this.filter(updatedUser);
  }

  async removeUser(id: string): Promise<MessageResponse> {
    await this.userRepository.delete({
      id,
    });

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
