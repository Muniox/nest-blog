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
import { UseRole } from '../../auth/decorators';
import { Role, MessageResponse } from '../../types';

@UseRole(Role.admin)
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.createUserFiltered(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAllUsersFiltered();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.userService.logoutUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.findOneUserFiltered(id);
  }

  @Patch(':id')
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(id, updateUserDto);
  }

  @Delete(':id')
  async removeUserByAdmin(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.removeUser(id);
  }
}
