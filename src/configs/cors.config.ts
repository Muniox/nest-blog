import {
  CorsOptions,
  CustomOrigin,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Cors implements CorsOptions {
  constructor(private configService: ConfigService) {}
  methods?: string | string[] = this.configService
    .get<string>('CORS_METHODS')
    .split(' ');
  credentials?: boolean = this.configService.get<boolean>('CORS_CREDENTIALS');
  origin?: (string | boolean | RegExp | (string | RegExp)[]) | CustomOrigin =
    this.configService.get<string>('CORS_CLIENT_URL').split(' ');
}
