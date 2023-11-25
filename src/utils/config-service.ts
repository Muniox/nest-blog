import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

export const configService = new ConfigService();

export const isProduction = (): boolean => {
  return (
    configService.get<'production' | 'development'>('NODE_ENV') === 'production'
  );
};
