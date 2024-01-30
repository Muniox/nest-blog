import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserResponse } from '../../types/user-response.type';
import { MessageResponse } from '../../types/message-response.type';
import { User, UseRole } from '../../auth/decorators';
import { Role } from '../../types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseRole(Role.admin)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.createUserFiltered(createUserDto);
  }

  @Get()
  @UseRole(Role.admin)
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAllUsersFiltered();
  }

  @Delete()
  async remove(@User('sub') userId: string): Promise<MessageResponse> {
    return await this.userService.removeUser(userId);
  }

  @Patch()
  async update(
    @User('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(userId, updateUserDto);
  }

  @Get('logout/:id')
  @UseRole(Role.admin)
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.userService.logoutUser(id);
  }

  @Get(':id')
  @UseRole(Role.admin)
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.findOneUserFiltered(id);
  }

  @Patch(':id')
  @UseRole(Role.admin)
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(id, updateUserDto);
  }

  @Delete(':id')
  @UseRole(Role.admin)
  async removeUserByAdmin(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.removeUser(id);
  }
}
