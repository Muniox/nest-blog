import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { CookieNames, JwtPayload } from '../../types';

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
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
