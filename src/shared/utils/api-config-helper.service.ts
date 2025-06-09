import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigHelperService {
  constructor(private configService: ConfigService) {}

  get isProduction(): boolean {
    return (
      this.configService.get<'production' | 'development'>('NODE_ENV') ===
      'production'
    );
  }
}
