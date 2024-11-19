import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import {
  AtCookieConfig,
  JwtAccessTokenConfig,
  JwtRefreshTokenConfig,
  RtCookieConfig,
} from '../configs';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { UserModule } from '../user/user.module';
import { AuthMapper } from './mappers';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    RtStrategy,
    AtStrategy,
    LocalStrategy,
    RtCookieConfig,
    AtCookieConfig,
    AuthMapper,
    JwtAccessTokenConfig,
    JwtRefreshTokenConfig,
  ],
})
export class AuthModule {}
