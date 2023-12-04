import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

// TODO: jak będzie trzeba SSL zrobić za pomocą proxy, to należy do throttlera dodać https://docs.nestjs.com/security/rate-limiting#async-configuration
export const getThrottlerConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => [
  {
    ttl: configService.get<number>('THROTTLE_TTL'),
    limit: configService.get<number>('THROTTLE_LIMIT'),
  },
];
