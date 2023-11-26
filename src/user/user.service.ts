import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { hashData } from '../utils';
import { IsNull, Not } from 'typeorm';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.findUserByEmail(createUserDto.email);

    if (user) {
      throw new ForbiddenException('User already exists');
    }

    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.hash = await hashData(createUserDto.password);
    await newUser.save();
    return newUser;
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return UserEntity.findOne({ where: { id } });
  }

  // Do sprawdzenia!
  async updateUserData(id: string, updateUserDto: UpdateUserDto) {
    const { email } = await this.findUserByEmail(updateUserDto.email);

    if (email === updateUserDto.email) {
      throw new ForbiddenException(`User with this email already exist`);
    }

    const isUser = await this.findOne(id);

    if (!isUser) {
      throw new ForbiddenException(`User with this id don't exist`);
    }

    await UserEntity.update({ id }, { ...updateUserDto });

    return {
      message: `User was updated`,
      statusCode: HttpStatus.OK,
    };
  }

  async updateUserHashRT(id: string, hashRT: string) {
    await UserEntity.update({ id }, { hashedRT: hashRT });
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
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
