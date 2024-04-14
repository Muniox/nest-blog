import { DataSource } from 'typeorm';

import { configService } from '../utils';

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  bigNumberStrings: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // autoLoadEntities: true,
  synchronize: false,
  logging: true,
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
});
