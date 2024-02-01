import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserResponse, Role, MessageResponse } from '../../types';
import { UseRole } from '../../auth/decorators';
import { AdminUserService } from '../services';

@UseRole(Role.admin)
@Controller('admin/user')
export class AdminUserController {
  constructor(private adminUserService: AdminUserService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.adminUserService.createUserFiltered(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<UserResponse[]> {
    return await this.adminUserService.findAllUsersFiltered();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.adminUserService.logoutUser(id);
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string): Promise<UserResponse> {
    return await this.adminUserService.findOneUserFiltered(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.adminUserService.updateUserFiltered(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<MessageResponse> {
    return await this.adminUserService.removeUser(id);
  }
}
