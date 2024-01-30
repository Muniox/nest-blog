import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController, AdminPostController } from './controllers';
import { UserModule } from '../user/user.module';
import { PostEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController, AdminPostController],
  providers: [PostService],
})
export class PostModule {}
