import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { CookieNames, JwtAccessToken, JwtReturnPayload } from '../../types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          return req && req.cookies
            ? req.cookies?.[CookieNames.ACCESS] ?? null
            : null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
      ignoreExpiration: true, //I will handle expiration time myself
    });
  }

  validate(payload: JwtReturnPayload): JwtAccessToken {
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Authorization token has expired.');
    }

    return payload;
  }
}
