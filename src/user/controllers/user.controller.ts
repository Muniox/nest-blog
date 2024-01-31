import { Body, Controller, Delete, Patch } from '@nestjs/common';

import { UserService } from '../services';
import { UpdateUserDto } from '../dto';
import { UserResponse, MessageResponse } from '../../types';
import { User } from '../../auth/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  async removeUser(@User('sub') userId: string): Promise<MessageResponse> {
    return await this.userService.removeUser(userId);
  }

  @Patch()
  async updateUser(
    @User('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(userId, updateUserDto);
  }
}
