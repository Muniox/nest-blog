import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto';
import { UserEntity, UserRoleEntity } from '../entities';
import { hashData } from '../../utils';
import { Repository } from 'typeorm';
import { MessageResponse, UserResponse, Role } from '../../types';
import { InjectRepository } from '@nestjs/typeorm';

// TODO: add username to user (needed for displaying who published post!)
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  filter(user: UserEntity): UserResponse {
    if (!user) throw new ForbiddenException("User don't exist");

    const { id, email, role } = user;
    return {
      id,
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
    const user: UserEntity = await this.findUserByEmail(updateUserDto.email);

    if (user?.email === updateUserDto.email) {
      throw new ConflictException(`User with this email already exist`);
    }

    await this.userRepository.update(
      { id },
      {
        email: updateUserDto.email,
        hash: await hashData(updateUserDto.password),
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

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createUserRoles(Object.values(Role));
  }

  async createUserRoles(roles: string[]): Promise<void> {
    // pozbywam się z tablicy wszystkich duplikatów
    const uniqueRoleArray = [...new Set(roles)];

    uniqueRoleArray.map(async (item: string): Promise<void> => {
      const searchRoleType = await this.userRoleRepository.findBy({
        roleType: item,
      });
      if (searchRoleType.length === 0) {
        const role: UserRoleEntity = new UserRoleEntity();
        role.roleType = item;
        await this.userRoleRepository.save(role);
      }
    });
  }
}