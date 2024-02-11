import { Body, Controller, Delete, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../services';
import { UpdateUserDto } from '../dto';
import { UserResponse, MessageResponse, UserATRequestData } from '../../types';
import { User } from '../../auth/decorators';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  async removeUser(
    @User(UserATRequestData.sub) userId: string,
  ): Promise<MessageResponse> {
    return await this.userService.removeUser(userId);
  }

  @Patch()
  async updateUser(
    @User(UserATRequestData.sub) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(userId, updateUserDto);
  }
}
