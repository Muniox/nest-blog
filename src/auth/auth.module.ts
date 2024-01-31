import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers';
import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AtCookieConfig, RtCookieConfig } from '../configs';
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
