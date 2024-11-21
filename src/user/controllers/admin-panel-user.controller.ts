import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto, AutomapperReadUserDto } from '../dto';
import { Role } from '../../types';
import { UseRole } from '../../auth/decorators';
import { AdminPanelUserService } from '../services';

@ApiTags('admin-panel')
@UseRole(Role.admin)
@Controller('admin-panel/user')
export class AdminPanelUserController {
  constructor(private adminPanelUserService: AdminPanelUserService) {}

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'create user account',
    description: 'Admin can create user account',
  })
  @ApiCreatedResponse({
    description: 'Return User Entity',
    type: AutomapperReadUserDto,
  })
  @ApiConflictResponse({
    description:
      'Conflict error after try to register User that have email or username taken',
  })
  @ApiBadRequestResponse({ description: 'Provided wrong data' })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AutomapperReadUserDto> {
    return await this.adminPanelUserService.createUser(createUserDto);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'get all users data',
    description: 'Admin can display all users data',
  })
  @ApiOkResponse({
    description: 'Return all users data',
    type: [AutomapperReadUserDto],
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @Get()
  async findAllUsers(): Promise<AutomapperReadUserDto[]> {
    return await this.adminPanelUserService.findAllUsersMapped();
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'logout selected user',
    description: 'Admin can logout selected user',
  })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.adminPanelUserService.logoutUser(id);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'get selected user data',
    description: 'Admin can get selected user data',
  })
  @ApiOkResponse({
    description: 'Return User Entity (user object)',
    type: AutomapperReadUserDto,
  })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Get(':id')
  async findOneUser(@Param('id') id: string): Promise<AutomapperReadUserDto> {
    return await this.adminPanelUserService.findOneUserMapped(id);
  }

  @ApiCookieAuth()
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
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiBadRequestResponse({ description: 'Provided wrong data' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    return await this.adminPanelUserService.updateUserMapped(id, updateUserDto);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'delete selected user account',
    description: 'Admin can delete selected user account',
  })
  @ApiNoContentResponse({ description: 'User was deleted' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<void> {
    return await this.adminPanelUserService.removeUser(id);
  }
}
