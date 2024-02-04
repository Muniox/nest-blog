import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

import { isProduction } from '../utils';

@Injectable()
export class AtCookieConfig implements CookieOptions {
  secure: boolean = isProduction();
  domain: string = this.configService.get<string>('APP_DOMAIN');
  httpOnly: boolean = true;
  constructor(private configService: ConfigService) {}
}
