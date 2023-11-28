import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from '../types/user-response.type';
import { MessageResponse } from '../types/message-response.type';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string) {
    await this.userService.logoutUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.findOneUser(id);
  }

  // update tylko dla admina, dodatkowe sprawdzenie poprawności hasła
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserData(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.remove(id);
  }
}
