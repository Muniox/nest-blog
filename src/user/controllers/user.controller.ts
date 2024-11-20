import { Body, Controller, Delete, HttpCode, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from '../services';
import { UpdateUserDto } from '../dto';
import { MessageResponse, UserAaccessTokenRequestData } from '../../types';
import { User } from '../../auth/decorators';
import { UserEntity } from '../entities';
import { AutomapperReadUserDto } from '../dto/automapper-read-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'delete account',
    description: 'User can delete his account',
  })
  @ApiResponse({
    status: 204,
    description: 'User was deleted',
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @HttpCode(204)
  @Delete()
  async removeUser(
    @User(UserAaccessTokenRequestData.userId) userId: string,
  ): Promise<MessageResponse> {
    return await this.userService.removeUser(userId);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'update profile',
    description: 'User can update his profile',
  })
  @ApiOkResponse({
    description: 'Return updated user entity',
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiBadRequestResponse({ description: 'Provided wrong data' })
  @ApiResponseProperty({
    type: UserEntity,
  })
  @Patch()
  async updateUser(
    @User(UserAaccessTokenRequestData.userId) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    return await this.userService.updateUserMapped(userId, updateUserDto);
  }
}
