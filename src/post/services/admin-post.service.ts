import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UpdatePostDto } from '../dto';
import { PostEntity } from '../entities';
import { PostResponse } from '../../types';
import { PostService } from './post.service';

@Injectable()
export class AdminPostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private postService: PostService,
  ) {}

  async updatePostByUser(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    const post: PostEntity = await this.postService.findOnePost(id);

    if (!post) {
      throw new ForbiddenException('There is no post with that id');
    }

    if (post.user.id === userId) {
      throw new ConflictException(
        'You can only edit posts of which you are the author',
      );
    }

    return await this.postService.update(post, file, updatePostDto);
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    const post: PostResponse = await this.postService.findOnePostFiltered(id);

    if (!post) {
      throw new ForbiddenException('There is no post with that id');
    }

    return await this.postService.update(post, file, updatePostDto);
  }

  async removePost(id: string): Promise<DeleteResult> {
    return await this.postRepository.delete({ id });
  }
}
