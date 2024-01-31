import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../dto';
import { UserEntity } from '../../user/entities/user.entity';
import { hashData } from '../../utils';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CookieNames, Tokens } from '../../types';
import { Response } from 'express';
import { AtCookieConfig, RtCookieConfig } from '../../configs';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UserResponse } from '../../types/user-response.type';
import { AdminUserService } from 'src/user/services/admin-user.service';

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

  private readonly jwtSecretActivationToken = this.configService.get<string>(
    'JWT_SECRET_ACCESS_TOKEN',
  );

  private readonly jwtExpirationTimeActivationToken =
    this.configService.get<string>('JWT_EXPIRATION_TIME_ACCESS_TOKEN');

  private readonly jwtSecretRefreshToken = this.configService.get<string>(
    'JWT_SECRET_REFRESH_TOKEN',
  );
  private readonly jwtExpirationTimeRefreshToken =
    this.configService.get<string>('JWT_EXPIRATION_TIME_REFRESH_TOKEN');

  async register(loginDto: AuthDto, res: Response): Promise<any> {
    const user = await this.adminUserService.createUserFiltered(loginDto);

    const tokens = await this.getAndUpdateTokens(user);

    return res
      .cookie(CookieNames.REFRESH, tokens.refreshToken, this.rtCookieConfig)
      .cookie(CookieNames.ACCESS, tokens.accessToken, this.atCookieConfig)
      .json({
        message: 'User was registered',
        statusCode: HttpStatus.CREATED,
      });
  }

  async login(
    user: UserEntity,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const tokens = await this.getAndUpdateTokens(user);

    return res
      .cookie(CookieNames.REFRESH, tokens.refreshToken, this.rtCookieConfig)
      .cookie(CookieNames.ACCESS, tokens.accessToken, this.atCookieConfig)
      .json({
        message: `User logged in`,
        statusCode: HttpStatus.OK,
      });
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
    const user = await this.userService.findOneUser(userId);

    if (!user || !user.hashedRT) throw new UnauthorizedException();

    const rtMatches = await argon2.verify(user.hashedRT, rt);
    if (!rtMatches) throw new UnauthorizedException();

    const tokens = await this.getAndUpdateTokens(user);

    return res
      .cookie(CookieNames.REFRESH, tokens.refreshToken, this.rtCookieConfig)
      .cookie(CookieNames.ACCESS, tokens.accessToken, this.atCookieConfig)
      .json({
        message: `Tokens were refreshed`,
        statusCode: HttpStatus.OK,
      });
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await argon2.verify(user.hash, password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async getAndUpdateTokens(user: UserResponse): Promise<Tokens> {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };
    const [at, rt] = await Promise.all([
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
    const hashRT = await hashData(refreshToken);
    await this.userService.updateUserHashRT(userId, hashRT);
  }
}
