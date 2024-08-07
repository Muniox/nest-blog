import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { Cors } from './configs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // validateCustomDecorators: true, //make error for globally only dunno why??
      transform: true,
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .addCookieAuth('Access', {
      type: 'apiKey',
      in: 'cookie',
    })
    .setTitle('nest-blog')
    .setDescription(
      'The blog API description.\n\n After creating an account and logging in, it is not necessary to add a cookie value to the swagger authorize input.',
    )
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());

  const cors = app.get(Cors);
  app.enableCors(cors);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('APP_PORT');
  const MODE = configService.get<number>('NODE_ENV');
  await app.listen(PORT, () =>
    Logger.log(`Application is working on port ${PORT} in ${MODE} mode`),
  );
}
bootstrap();
