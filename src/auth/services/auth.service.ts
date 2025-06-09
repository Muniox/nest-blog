import {
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { CookieName, JwtPayload, Tokens } from '../../shared/types';
import {
  AccessTokenCookieConfig,
  JwtAccessTokenConfig,
  JwtRefreshTokenConfig,
  RefreshTokenCookieConfig,
} from '../../shared/infrastructure/configs';
import { UserEntity } from '../../user/entities';
import {
  AutomapperReadAuthUserDto,
  ValidationResponseAuthMessageDto,
  ValidationRequestAuthDto,
} from '../dtos';
import {
  ADMIN_PANEL_SERVICE_TOKEN,
  AdminPanelUserServiceInterface,
  UserServiceInterface,
  USER_SERVICE_TOKEN,
} from '../../user/interfaces';
import { HashService } from '../../shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenCookieConfig: RefreshTokenCookieConfig,
    private accessTokenCookieConfig: AccessTokenCookieConfig,
    @Inject(USER_SERVICE_TOKEN) private userService: UserServiceInterface,
    @Inject(ADMIN_PANEL_SERVICE_TOKEN)
    private adminUserService: AdminPanelUserServiceInterface,
    private jwtRefreshTokenConfig: JwtRefreshTokenConfig,
    private jwtAccessTokenConfig: JwtAccessTokenConfig,
    @InjectMapper() private readonly classMapper: Mapper,
    private hashService: HashService,
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
    const mapToUserDTO = this.classMapper.map(
      user, // what data I get
      UserEntity, // what type/blueprint data is right now
      AutomapperReadAuthUserDto, // what blueprint i want to get (example. without password)
    );

    const tokens: Tokens = await this.getAndUpdateTokens(mapToUserDTO);

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

    return mapToUserDTO;
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

    const rtMatches: boolean = await this.hashService.compareData(
      user.hashedRefreshToken,
      rt,
    );
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

    if (!(await this.hashService.compareData(user.hash, password))) {
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

  // Refresh Token and Access Token payload
  async getTokens(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken]: [
      accessToken: string,
      refreshToken: string,
    ] = await Promise.all([
      this.jwtService.signAsync(payload, this.jwtAccessTokenConfig.config),
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
    const hashedRefreshToken: string =
      await this.hashService.hashData(refreshToken);
    await this.userService.updateUserHashRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }
}
