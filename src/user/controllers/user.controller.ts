import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from '../services';
import { ValidationRequestUpdateUserDto } from '../dto';
import { UserAaccessTokenRequestData } from '../../types';
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
  @ApiNoContentResponse({
    description: 'User was deleted',
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async removeUser(
    @User(UserAaccessTokenRequestData.userId) userId: string,
  ): Promise<void> {
    return await this.userService.removeUser(userId);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'update profile',
    description: 'User can update his profile',
  })
  @ApiOkResponse({
    description: 'Return updated user entity',
    type: AutomapperReadUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiBadRequestResponse({ description: 'Provided wrong data' })
  @ApiResponseProperty({
    type: UserEntity,
  })
  @Patch()
  async updateUser(
    @User(UserAaccessTokenRequestData.userId) userId: string,
    @Body() updateUserDto: ValidationRequestUpdateUserDto,
  ): Promise<AutomapperReadUserDto> {
    return await this.userService.updateUserMapped(userId, updateUserDto);
  }
}
