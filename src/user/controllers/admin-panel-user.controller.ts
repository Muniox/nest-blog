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
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
    summary: 'create user account',
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

  @ApiOperation({
    summary: 'get all users data',
    description: 'Admin can display all users data',
  })
  @ApiOkResponse({
    description: 'Return all users data',
  })
  @Get()
  async findAllUsers(): Promise<UserResponse[]> {
    return await this.adminPanelUserService.findAllUsersFiltered();
  }

  @ApiOperation({
    summary: 'logout selected user',
    description: 'Admin can logout selected user',
  })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.adminPanelUserService.logoutUser(id);
  }

  @ApiOperation({
    summary: 'get selected user data',
    description: 'Admin can get selected user data',
  })
  @ApiOkResponse({ description: 'Return User Entity (user object)' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Get(':id')
  async findOneUser(@Param('id') id: string): Promise<UserResponse> {
    return await this.adminPanelUserService.findOneUserFiltered(id);
  }

  @ApiOperation({
    summary: 'update selected user data',
    description: 'Admin can update selected user data',
  })
  @ApiOkResponse({ description: 'Return updated User Entity (user object)' })
  @ApiConflictResponse({
    description:
      'Conflict error after try to update User with email or username that was taken',
  })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
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

  @ApiOperation({
    summary: 'delete selected user account',
    description: 'Admin can delete selected user account',
  })
  @ApiOkResponse({ description: 'User was deleted' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<MessageResponse> {
    return await this.adminPanelUserService.removeUser(id);
  }
}
