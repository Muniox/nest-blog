import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService, AdminPostService } from './services';
import { PostController, AdminPostController } from './controllers';
import { PostEntity } from './entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController, AdminPostController],
  providers: [PostService, AdminPostService],
})
export class PostModule {}
