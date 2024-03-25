import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserResponse, Role, MessageResponse } from '../../types';
import { UseRole } from '../../auth/decorators';
import { AdminPanelUserService } from '../services';

@ApiTags('admin-panel')
@UseRole(Role.admin)
@Controller('admin-panel/user')
export class AdminPanelUserController {
  constructor(private adminPanelUserService: AdminPanelUserService) {}

  @ApiOperation({
    summary: 'admin create user account',
    description: 'Admin can create user account',
  })
  @ApiCreatedResponse({
    description: 'Return User Entity',
  })
  @ApiConflictResponse({
    description:
      'Conflict error after try to register User that have email or username taken',
  })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.adminPanelUserService.createUserFiltered(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<UserResponse[]> {
    return await this.adminPanelUserService.findAllUsersFiltered();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.adminPanelUserService.logoutUser(id);
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string): Promise<UserResponse> {
    return await this.adminPanelUserService.findOneUserFiltered(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.adminPanelUserService.updateUserFiltered(
      id,
      updateUserDto,
    );
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<MessageResponse> {
    return await this.adminPanelUserService.removeUser(id);
  }
}
