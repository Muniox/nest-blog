import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

import { isProduction } from '../utils';

@Injectable()
export class RtCookieConfig implements CookieOptions {
  secure: boolean = isProduction();
  sameSite: boolean = isProduction(); // TODO: sprawdzić czy frontend będzie działać na sameSite
  domain: string = this.configService.get<string>('APP_DOMAIN');
  httpOnly: boolean = isProduction();
  path: string = this.configService.get<string>('APP_REFRESH_PATH');
  constructor(private configService: ConfigService) {}
}
