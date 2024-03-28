import { Body, Controller, Delete, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from '../services';
import { UpdateUserDto } from '../dto';
import { UserResponse, MessageResponse, UserATRequestData } from '../../types';
import { User } from '../../auth/decorators';
import { UserEntity } from '../entities';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: czy nie powinienj zwracać no content zamiast ok 200?
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'delete account',
    description: 'User can delete his account',
  })
  @ApiOkResponse({ description: 'User was deleted' })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @Delete()
  async removeUser(
    @User(UserATRequestData.sub) userId: string,
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
    @User(UserATRequestData.sub) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(userId, updateUserDto);
  }
}
