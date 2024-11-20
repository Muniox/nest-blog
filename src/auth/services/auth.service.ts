import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { CookieName, JwtPayload, Tokens } from '../../types';
import {
  AccessTokenCookieConfig,
  JwtAccessTokenConfig,
  JwtRefreshTokenConfig,
  RefreshTokenCookieConfig,
} from '../../configs';
import { UserService, AdminPanelUserService } from '../../user/services';
import { AuthDto } from '../dto';
import { UserEntity } from '../../user/entities';
import { hashData } from '../../utils';
import { ReadAuthUserDto } from '../dto/read-auth-user.dto';
import { AutomapperReadUserDto } from 'src/user/dto/automapper-read-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenCookieConfig: RefreshTokenCookieConfig,
    private accessTokenCookieConfig: AccessTokenCookieConfig,
    private userService: UserService,
    private adminUserService: AdminPanelUserService,
    private jwtRefreshTokenConfig: JwtRefreshTokenConfig,
    private jwtAccesTokenConfig: JwtAccessTokenConfig,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async register(loginDto: AuthDto, res: Response): Promise<any> {
    const user: AutomapperReadUserDto =
      await this.adminUserService.createUser(loginDto);

    const tokens: Tokens = await this.getAndUpdateTokens(user);

    return res
      .cookie(
        CookieName.REFRESH,
        tokens.refreshToken,
        this.refreshTokenCookieConfig,
      )
      .cookie(
        CookieName.ACCESS,
        tokens.accessToken,
        this.accessTokenCookieConfig,
      )
      .json({
        message: 'User was registered',
        statusCode: HttpStatus.CREATED,
      });
  }

  async login(user: UserEntity, res: Response): Promise<ReadAuthUserDto> {
    const tokens: Tokens = await this.getAndUpdateTokens(user);

    const mappToUserDTO = this.classMapper.map(
      user,
      UserEntity,
      ReadAuthUserDto,
    );

    res
      .cookie(
        CookieName.REFRESH,
        tokens.refreshToken,
        this.refreshTokenCookieConfig,
      )
      .cookie(
        CookieName.ACCESS,
        tokens.accessToken,
        this.accessTokenCookieConfig,
      );

    return mappToUserDTO;
  }

  async logout(
    userId: string,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    await this.adminUserService.logoutUser(userId);

    return res
      .clearCookie(CookieName.ACCESS, {
        domain: this.configService.get<string>('APP_DOMAIN'),
        path: '/',
      })
      .clearCookie(CookieName.REFRESH, {
        domain: this.configService.get<string>('APP_DOMAIN'),
        path: this.configService.get<string>('APP_REFRESH_PATH'),
      })
      .json({
        message: 'User was logged out',
        statusCode: HttpStatus.OK,
      });
  }

  async refreshTokens(
    userId: string,
    rt: string | null,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user: UserEntity = await this.userService.findOneUser(userId);

    if (!user || !user.hashedRT) throw new UnauthorizedException();

    const rtMatches: boolean = await argon2.verify(user.hashedRT, rt);
    if (!rtMatches) throw new UnauthorizedException();

    const tokens: Tokens = await this.getAndUpdateTokens(user);

    return res
      .cookie(
        CookieName.REFRESH,
        tokens.refreshToken,
        this.refreshTokenCookieConfig,
      )
      .cookie(
        CookieName.ACCESS,
        tokens.accessToken,
        this.accessTokenCookieConfig,
      )
      .json({
        message: `Tokens were refreshed`,
        statusCode: HttpStatus.OK,
      });
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await argon2.verify(user.hash, password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async getAndUpdateTokens(
    user: UserEntity | AutomapperReadUserDto,
  ): Promise<Tokens> {
    const tokens: Tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      username: user.username,
    });
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  // Rfresh Token and Access Token payload
  async getTokens(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken]: [
      accessToken: string,
      refreshToken: string,
    ] = await Promise.all([
      this.jwtService.signAsync(payload, this.jwtAccesTokenConfig.config),
      this.jwtService.signAsync(payload, this.jwtRefreshTokenConfig.config),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRtHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken: string = await hashData(refreshToken);
    await this.userService.updateUserHashRT(userId, hashedRefreshToken);
  }
}
