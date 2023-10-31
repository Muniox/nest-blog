import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import { envValidationObjectSchema } from "./config";


@Module({
  imports: [ConfigModule.forRoot({
      validationSchema: envValidationObjectSchema,
  }),DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
