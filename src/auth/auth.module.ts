import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import { AtCookieConfig, RtCookieConfig } from '../configs';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { UserModule } from '../user/user.module';

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
  ],
})
export class AuthModule {}
