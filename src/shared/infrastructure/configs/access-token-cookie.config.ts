import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

import { ApiConfigHelperService } from '../../utils';

@Injectable()
export class AccessTokenCookieConfig implements CookieOptions {
  constructor(
    private configService: ConfigService,
    private apiConfigHelper: ApiConfigHelperService,
  ) {}

  secure: boolean = this.apiConfigHelper.isProduction;
  sameSite: boolean = this.apiConfigHelper.isProduction; // TODO: sprawdzić czy frontend będzie działać na sameSite
  domain: string = this.configService.get<string>('APP_DOMAIN');
  httpOnly: boolean = this.apiConfigHelper.isProduction;
}
