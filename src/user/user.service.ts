import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { hashData } from '../utils';
import { IsNull, Not } from 'typeorm';
import { MessageResponse } from '../types/message-response.type';
import { UserResponse } from '../types/user-response.type';

@Injectable()
export class UserService {
  filter(user: UserEntity) {
    const { id, email } = user;
    return {
      id,
      email,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = this.findUserByEmail(createUserDto.email);

    if (user) {
      throw new ForbiddenException('User already exists');
    }

    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.hash = await hashData(createUserDto.password);
    await newUser.save();
    return this.filter(newUser);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await UserEntity.find();
    return users.map((user) => this.filter(user));
  }

  async findOne(id: string) {
    return UserEntity.findOne({ where: { id } });
  }

  // Do sprawdzenia!
  async updateUserData(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { email } = await this.findUserByEmail(updateUserDto.email);

    if (email === updateUserDto.email) {
      throw new ForbiddenException(`User with this email already exist`);
    }

    await UserEntity.update({ id }, { ...updateUserDto });

    const user = await this.findOne(id);

    if (!user) {
      throw new ForbiddenException(`User with this id don't exist`);
    }

    return user;
  }

  async remove(id: string): Promise<MessageResponse> {
    await UserEntity.delete({
      id,
    });

    return {
      message: 'User was deleted',
      statusCode: HttpStatus.OK,
    };
  }

  async updateUserHashRT(id: string, hashRT: string): Promise<void> {
    await UserEntity.update({ id }, { hashedRT: hashRT });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await UserEntity.findOne({
      where: { email },
    });
  }

  async logoutUser(id: string): Promise<void> {
    await UserEntity.update(
      { id, hashedRT: Not(IsNull()) },
      { hashedRT: null },
    );
  }
}
