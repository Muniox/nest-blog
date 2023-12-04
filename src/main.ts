import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Cors } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());

  const cors = app.get(Cors);
  app.enableCors(cors);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('APP_PORT');
  await app.listen(PORT, () =>
    Logger.log(`Application is working on port ${PORT}`),
  );
}
bootstrap();
