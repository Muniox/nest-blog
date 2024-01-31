import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { isProduction } from '../utils';

@Injectable()
export class RtCookieConfig implements CookieOptions {
  secure = isProduction();
  domain = this.configService.get<string>('APP_DOMAIN');
  httpOnly = true;
  path = this.configService.get<string>('APP_REFRESH_PATH');
  constructor(private configService: ConfigService) {}
}
