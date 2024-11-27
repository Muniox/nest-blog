import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService, AdminPanelPostService } from './services';
import { PostController, AdminPanelPostController } from './controllers';
import { PostEntity } from './entities';
import { UserModule } from '../user/user.module';
import { PostMapper } from './mappers/post.mapper';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController, AdminPanelPostController],
  providers: [PostService, AdminPanelPostService, PostMapper],
})
export class PostModule {}
