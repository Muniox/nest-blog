import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserEntity, UserRoleEntity } from '../entities';
import { hashData } from '../../utils';
import { MessageResponse, UserResponse } from '../../types';
import { UserService } from './user.service';

// TODO: add username to user (needed for displaying who published post!)
@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
    private userService: UserService,
  ) {}

  async createUserFiltered(
    createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    const user: UserEntity = await this.userService.findUserByEmailOrUsername(
      createUserDto.email,
      createUserDto.username,
    );

    if (user?.email === createUserDto.email) {
      throw new ConflictException('User with that email already exists');
    }

    if (user?.username === createUserDto.username) {
      throw new ConflictException('User with that username already exists');
    }

    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.username = createUserDto.username;
    newUser.hash = await hashData(createUserDto.password);
    newUser.role = await this.userRoleRepository.findOne({
      where: { roleType: 'user' },
    });
    await this.userRepository.save(newUser);
    return this.userService.filter(newUser);
  }

  async findAllUsersFiltered(): Promise<UserResponse[]> {
    const users: UserEntity[] = await this.userRepository.find({
      relations: { role: true },
    });
    return users.map((user: UserEntity) => this.userService.filter(user));
  }

  async findOneUserFiltered(id: string): Promise<UserResponse> {
    return this.userService.filter(await this.userService.findOneUser(id));
  }

  async updateUserFiltered(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(id, updateUserDto);
  }

  async removeUser(id: string): Promise<MessageResponse> {
    return await this.userService.removeUser(id);
  }

  async logoutUser(id: string): Promise<void> {
    await this.userRepository.update(
      { id, hashedRT: Not(IsNull()) },
      { hashedRT: null },
    );
  }
}
