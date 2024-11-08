import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshTokenConfig implements JwtSignOptions {
  constructor(private configService: ConfigService) {}

  secret?: string | Buffer = this.configService.get<string>(
    'JWT_SECRET_REFRESH_TOKEN',
  );

  expiresIn?: string | number = this.configService.get<string>(
    'JWT_EXPIRATION_TIME_REFRESH_TOKEN',
  );
}
