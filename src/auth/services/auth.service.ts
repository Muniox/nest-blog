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
import { UserEntity } from '../../user/entities';
import { hashData } from '../../utils';
import {
  AutomapperReadAuthUserDto,
  ValidationResponseAuthMessageDto,
  ValidationRequestAuthDto,
} from '../dtos';

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

  async register(
    loginDto: ValidationRequestAuthDto,
    res: Response,
  ): Promise<ValidationResponseAuthMessageDto> {
    const user: AutomapperReadAuthUserDto =
      await this.adminUserService.createUser(loginDto);

    const tokens: Tokens = await this.getAndUpdateTokens(user);

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

    return new ValidationResponseAuthMessageDto({
      message: 'User was registered',
      statusCode: HttpStatus.CREATED,
    });
  }

  async login(
    user: UserEntity,
    res: Response,
  ): Promise<AutomapperReadAuthUserDto> {
    const mappToUserDTO = this.classMapper.map(
      user, // what data I get
      UserEntity, // what type/blueprint data is right now
      AutomapperReadAuthUserDto, // what blueprint i want to get (example. without password)
    );

    const tokens: Tokens = await this.getAndUpdateTokens(mappToUserDTO);

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
  ): Promise<ValidationResponseAuthMessageDto> {
    await this.adminUserService.logoutUser(userId);

    res
      .clearCookie(CookieName.ACCESS, {
        domain: this.configService.get<string>('APP_DOMAIN'),
        path: '/',
      })
      .clearCookie(CookieName.REFRESH, {
        domain: this.configService.get<string>('APP_DOMAIN'),
        path: this.configService.get<string>('APP_REFRESH_PATH'),
      });

    return new ValidationResponseAuthMessageDto({
      message: 'User was logged out',
      statusCode: HttpStatus.OK,
    });
  }

  async refreshTokens(
    userId: string,
    rt: string | null,
    res: Response,
  ): Promise<ValidationResponseAuthMessageDto> {
    const user: UserEntity = await this.userService.findOneUser(userId);

    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

    const rtMatches: boolean = await argon2.verify(user.hashedRefreshToken, rt);
    if (!rtMatches) throw new UnauthorizedException();

    const mappToUserDTO = this.classMapper.map(
      user,
      UserEntity,
      AutomapperReadAuthUserDto,
    );

    const tokens: Tokens = await this.getAndUpdateTokens(mappToUserDTO);

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

    return new ValidationResponseAuthMessageDto({
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
    user: AutomapperReadAuthUserDto,
  ): Promise<Tokens> {
    const tokens: Tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      username: user.username,
    });
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
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

  private async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken: string = await hashData(refreshToken);
    await this.userService.updateUserHashRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }
}
