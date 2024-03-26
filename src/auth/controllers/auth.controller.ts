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
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'register user',
    description: 'Register new user',
  })
  @ApiCreatedResponse({ description: 'User was registered succesfully' })
  @ApiConflictResponse({
    description:
      'Conflict error after try to register User that have email or username taken',
  })
  @ApiBadRequestResponse({
    description:
      'Email or password is not correct or does not meet security requirements',
  })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() dto: AuthDto, @Res() res: Response): Promise<Tokens> {
    return this.authService.register(dto, res);
  }

  @ApiOperation({
    summary: 'user log in',
    description: 'After registration user can login',
  })
  @ApiOkResponse({ description: 'User succesfully log in' })
  @ApiUnauthorizedResponse({ description: 'Wrong username or password' })
  @ApiBody({
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

  @ApiOperation({
    summary: 'user log out',
    description: 'User can log out of the api',
  })
  @ApiOkResponse({ description: 'User succesfully log out' })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @User(UserATRequestData.sub) userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.logout(userId, res);
  }

  @ApiOperation({
    summary: 'refresh tokens',
    description: 'User can refresh tokens after access token expired',
  })
  @ApiOkResponse({ description: 'Tokens were refreshed' })
  @ApiUnauthorizedResponse({
    description:
      'User must be logged in to refresh tokens or refresh token expired',
  })
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
