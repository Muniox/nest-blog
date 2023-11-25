import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {Logger} from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configService = app.get(ConfigService);
    const PORT = configService.get<number>('APP_PORT');
  await app.listen(PORT, () => Logger.log(`Application is working on port ${PORT}`));
}
bootstrap();
