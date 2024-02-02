import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { CookieNames, JwtPayload } from '../../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          return req && req.cookies
            ? req.cookies?.[CookieNames.REFRESH] ?? null
            : null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken: string = req.cookies?.[CookieNames.REFRESH];
    return {
      ...payload,
      refreshToken,
    };
  }
}
