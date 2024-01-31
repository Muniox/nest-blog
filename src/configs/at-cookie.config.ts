import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

import { isProduction } from '../utils';

@Injectable()
export class AtCookieConfig implements CookieOptions {
  secure = isProduction();
  domain = this.configService.get<string>('APP_DOMAIN');
  httpOnly = true;
  constructor(private configService: ConfigService) {}
}
