import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from '../services';
import {
  Tokens,
  UserATRequestData,
  UserResponse,
  UserRTRequestData,
} from '../../types';
import { RtGuard, LocalAuthGuard } from '../guards';
import { User, Public } from '../decorators';
import { UserEntity } from '../../user/entities';
import { AuthDto } from '../dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  @ApiBody({
    description: 'user register data',
    type: AuthDto,
  })
  @ApiCreatedResponse({ description: 'User was registered succesfully' })
  @ApiConflictResponse({
    description:
      'Conflict error after try to register User that have email or username taken',
  })
  async register(@Body() dto: AuthDto, @Res() res: Response): Promise<Tokens> {
    return this.authService.register(dto, res);
  }

  @ApiBody({
    description: 'user login data',
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @User() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    return this.authService.login(user, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @User(UserATRequestData.sub) userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.logout(userId, res);
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refreshTokens(
    @User(UserRTRequestData.refreshToken) refreshToken: string,
    @User(UserRTRequestData.sub) userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.refreshTokens(userId, refreshToken, res);
  }
}
