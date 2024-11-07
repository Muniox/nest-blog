import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
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
