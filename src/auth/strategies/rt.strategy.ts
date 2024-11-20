import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { CookieName, JwtRefreshToken, JwtReturnPayload } from '../../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          return req && req.cookies
            ? req.cookies?.[CookieName.REFRESH] ?? null
            : null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      passReqToCallback: true,
      ignoreExpiration: true, //I will handle expiration time myself
    });
  }

  validate(req: Request, payload: JwtReturnPayload): JwtRefreshToken {
    const refreshToken: string = req.cookies?.[CookieName.REFRESH];

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Refresh token has expired.');
    }

    return {
      refreshToken,
      ...payload,
    };
  }
}
