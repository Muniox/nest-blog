import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Response } from 'express';

import { CookieNames, JwtPayload, Tokens, UserResponse } from '../../types';
import { AtCookieConfig, RtCookieConfig } from '../../configs';
import { UserService, AdminUserService } from '../../user/services';
import { AuthDto } from '../dto';
import { UserEntity } from '../../user/entities';
import { hashData } from '../../utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private rtCookieConfig: RtCookieConfig,
    private atCookieConfig: AtCookieConfig,
    private userService: UserService,
    private adminUserService: AdminUserService,
  ) {}

  private readonly jwtSecretActivationToken: string =
    this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN');

  private readonly jwtExpirationTimeActivationToken: string =
    this.configService.get<string>('JWT_EXPIRATION_TIME_ACCESS_TOKEN');

  private readonly jwtSecretRefreshToken: string =
    this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN');

  private readonly jwtExpirationTimeRefreshToken: string =
    this.configService.get<string>('JWT_EXPIRATION_TIME_REFRESH_TOKEN');

  async register(loginDto: AuthDto, res: Response): Promise<any> {
    const user: UserResponse =
      await this.adminUserService.createUserFiltered(loginDto);

    const tokens: Tokens = await this.getAndUpdateTokens(user);

    return res
      .cookie(CookieNames.REFRESH, tokens.refreshToken, this.rtCookieConfig)
      .cookie(CookieNames.ACCESS, tokens.accessToken, this.atCookieConfig)
      .json({
        message: 'User was registered',
        statusCode: HttpStatus.CREATED,
      });
  }

  async login(user: UserEntity, res: Response): Promise<UserResponse> {
    const tokens: Tokens = await this.getAndUpdateTokens(user);

    res
      .cookie(CookieNames.REFRESH, tokens.refreshToken, this.rtCookieConfig)
      .cookie(CookieNames.ACCESS, tokens.accessToken, this.atCookieConfig);

    return this.userService.filter(user);
  }

  async logout(
    userId: string,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    await this.adminUserService.logoutUser(userId);

    return res
      .clearCookie(CookieNames.ACCESS)
      .clearCookie(CookieNames.REFRESH)
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
      .cookie(CookieNames.REFRESH, tokens.refreshToken, this.rtCookieConfig)
      .cookie(CookieNames.ACCESS, tokens.accessToken, this.atCookieConfig)
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

  private async getAndUpdateTokens(user: UserResponse): Promise<Tokens> {
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
    const [at, rt]: [at: string, rt: string] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecretActivationToken,
        expiresIn: this.jwtExpirationTimeActivationToken,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecretRefreshToken,
        expiresIn: this.jwtExpirationTimeRefreshToken,
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  private async updateRtHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashRT: string = await hashData(refreshToken);
    await this.userService.updateUserHashRT(userId, hashRT);
  }
}
