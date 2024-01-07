import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import { AtCookieConfig, RtCookieConfig } from '../config';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, UserModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        RtStrategy,
        AtStrategy,
        LocalStrategy,
        RtCookieConfig,
        AtCookieConfig,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
