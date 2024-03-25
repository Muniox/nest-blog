import { Body, Controller, Delete, Patch } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
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

  @ApiOperation({
    summary: 'user delet his account',
    description: 'User can delete his account',
  })
  @ApiOkResponse({ description: 'User was deleted' })
  @Delete()
  async removeUser(
    @User(UserATRequestData.sub) userId: string,
  ): Promise<MessageResponse> {
    return await this.userService.removeUser(userId);
  }

  @ApiOperation({
    summary: 'user update his profile',
    description: 'User can update his profile',
  })
  @ApiResponseProperty({
    type: UserEntity,
  })
  @ApiOkResponse({
    description: 'Return updated user entity',
  })
  @Patch()
  async updateUser(
    @User(UserATRequestData.sub) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(userId, updateUserDto);
  }
}
