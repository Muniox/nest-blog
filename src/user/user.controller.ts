import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from '../types/user-response.type';
import { MessageResponse } from '../types/message-response.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseRole } from '../auth/decorators';
import { Role } from '../types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @UseRole(Role.admin)
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Get('logout/:id')
  async logoutUser(@Param('id') id: string): Promise<void> {
    await this.userService.logoutUser(id);
  }

  @Get(':id')
  @UseRole(Role.admin)
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.findOneUser(id);
  }

  @Patch(':id')
  @UseRole(Role.admin)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.updateUserData(id, updateUserDto);
  }

  @Delete(':id')
  @UseRole(Role.admin)
  async remove(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.remove(id);
  }

  // TODO: Dodatkowa ścieżka aby user mógł usunąć własne konto
  // TODO: Dodatkowa ścieżka aby user mógł sprawdzić własne dane
  // TODO: Dodatkowa ścieżka aby user mógł wprowadzić poprawki w własnych danych
}
