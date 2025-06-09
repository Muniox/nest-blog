import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Response } from 'express';

import { AuthService } from '../services';
import {
  UserAccessTokenRequestData,
  UserRefreshTokenRequestData,
} from '../../shared/types';
import { RtGuard, LocalAuthGuard } from '../guards';
import { User, Public } from '../decorators';
import { UserEntity } from '../../user/entities';
import {
  ValidationRequestLoginDto,
  AutomapperReadAuthUserDto,
  ValidationRequestAuthDto,
} from '../dtos';
import { ValidationResponseAuthMessageDto } from '../dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'register user',
    description: 'Register new user',
  })
  @ApiCreatedResponse({
    description: 'User was registered successfully',
    type: ValidationResponseAuthMessageDto,
  })
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
  async register(
    @Body() dto: ValidationRequestAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ValidationResponseAuthMessageDto> {
    return await this.authService.register(dto, res);
  }

  @ApiOperation({
    summary: 'user log in',
    description: 'After registration user can login',
  })
  @ApiOkResponse({
    description: 'User successfully log in',
    type: AutomapperReadAuthUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Wrong username or password' })
  @ApiBody({
    type: ValidationRequestLoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @User() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AutomapperReadAuthUserDto> {
    return await this.authService.login(user, res);
  }

  // @TODO: Zastanowić się czy nie zrobić no content?
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'user log out',
    description: 'User can log out of the api',
  })
  @ApiOkResponse({
    description: 'User successfully log out',
    type: ValidationResponseAuthMessageDto,
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @User(UserAccessTokenRequestData.userId) userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ValidationResponseAuthMessageDto> {
    return await this.authService.logout(userId, res);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'refresh tokens',
    description: 'User can refresh tokens after access token expired',
  })
  @ApiOkResponse({
    description: 'Tokens were refreshed',
    type: ValidationResponseAuthMessageDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'User must be logged in to refresh tokens or refresh token expired',
  })
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refreshTokens(
    @User(UserRefreshTokenRequestData.refreshToken) refreshToken: string,
    @User(UserRefreshTokenRequestData.userId) userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ValidationResponseAuthMessageDto> {
    return await this.authService.refreshTokens(userId, refreshToken, res);
  }
}
