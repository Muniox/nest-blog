import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { hashData } from '../utils';
import { IsNull, Not, Repository } from 'typeorm';
import { MessageResponse } from '../types/message-response.type';
import { UserResponse } from '../types/user-response.type';
import { UserRoleEntity } from './entities/user-role.entity';
import { Role } from '../types';
import { InjectRepository } from '@nestjs/typeorm';

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

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user: UserEntity = await this.findUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.hash = await hashData(createUserDto.password);
    newUser.role = await this.userRoleRepository.findOne({
      where: { roleType: 'user' },
    });
    await this.userRepository.save(newUser);
    return this.filter(newUser);
  }

  async findAll(): Promise<UserResponse[]> {
    const users: UserEntity[] = await this.userRepository.find({
      relations: { role: true },
    });
    return users.map((user: UserEntity) => this.filter(user));
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async findOneUser(id: string): Promise<UserResponse> {
    return this.filter(await this.findOne(id));
  }

  async update(
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

    const updatedUser: UserEntity = await this.findOne(id);

    if (!updatedUser) {
      throw new ForbiddenException(`User with this id don't exist`);
    }

    return this.filter(updatedUser);
  }

  async remove(id: string): Promise<MessageResponse> {
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

  async logoutUser(id: string): Promise<void> {
    await this.userRepository.update(
      { id, hashedRT: Not(IsNull()) },
      { hashedRT: null },
    );
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
