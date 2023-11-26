import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AtCookieConfig, RtCookieConfig } from '../config';
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
