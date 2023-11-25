import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import { envValidationObjectSchema } from "./config";
import { UserModule } from './user/user.module';


@Module({
  imports: [ConfigModule.forRoot({
      validationSchema: envValidationObjectSchema,
  }), DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
