import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserResponse } from '../types/user-response.type';
import { MessageResponse } from '../types/message-response.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string) {
    await this.userService.logoutUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findOne(id);
  }

  // update tylko dla admina
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UserEntity,
  ): Promise<UserEntity> {
    return await this.userService.updateUserData(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.remove(id);
  }
}
