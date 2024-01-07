import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from '../types/user-response.type';
import { MessageResponse } from '../types/message-response.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UseRole } from '../auth/decorators';
import { Role } from '../types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @UseRole(Role.admin)
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Delete()
  async remove(@User('sub') userId: string): Promise<MessageResponse> {
    return await this.userService.remove(userId);
  }

  @Patch()
  async update(
    @User('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.update(userId, updateUserDto);
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.userService.logoutUser(id);
  }

  @Get(':id')
  @UseRole(Role.admin)
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.findOneUser(id);
  }

  @Patch(':id')
  @UseRole(Role.admin)
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseRole(Role.admin)
  async removeUserByAdmin(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.remove(id);
  }
}
