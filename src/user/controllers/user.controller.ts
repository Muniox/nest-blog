import { Body, Controller, Delete, Patch } from '@nestjs/common';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dto';
import { UserResponse } from '../../types/user-response.type';
import { MessageResponse } from '../../types/message-response.type';
import { User } from '../../auth/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  async remove(@User('sub') userId: string): Promise<MessageResponse> {
    return await this.userService.removeUser(userId);
  }

  @Patch()
  async update(
    @User('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserFiltered(userId, updateUserDto);
  }
}
