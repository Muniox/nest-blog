import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserResponse } from '../../types/user-response.type';
import { UseRole } from '../../auth/decorators';
import { Role, MessageResponse } from '../../types';
import { AdminUserService } from '../services/admin-user.service';

@UseRole(Role.admin)
@Controller('admin/user')
export class AdminUserController {
  constructor(
    private userService: UserService,
    private adminUserService: AdminUserService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.adminUserService.createUserFiltered(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.adminUserService.findAllUsersFiltered();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.adminUserService.logoutUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return await this.adminUserService.findOneUserFiltered(id);
  }

  @Patch(':id')
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.adminUserService.updateUserFiltered(id, updateUserDto);
  }

  @Delete(':id')
  async removeUserByAdmin(@Param('id') id: string): Promise<MessageResponse> {
    return await this.adminUserService.removeUser(id);
  }
}
