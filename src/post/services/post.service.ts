import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, ReadStream } from 'fs';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sanitizeHtml from 'sanitize-html';

import { CreatePostDto, UpdatePostDto } from '../dto';
import { PostEntity } from '../entities';
import { UserService } from '../../user/services';
import { UserEntity } from '../../user/entities';
import { PostResponse } from '../../types';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private userService: UserService,
  ) {}

  filter(post: PostEntity): PostResponse {
    const {
      id,
      title,
      description,
      img,
      createdAt,
      updatedAt,
      category,
      user,
    } = post;
    const { role, username } = user;
    const { roleType } = role;

    return {
      id,
      title,
      description,
      img,
      createdAt,
      updatedAt,
      category,
      user: {
        username,
        role: {
          roleType,
        },
      },
    };
  }

  async createPostFiltered(
    createPostDto: CreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    const filename: string = `${uuid()}.${mime.getExtension(file?.mimetype)}`;

    try {
      await fs.writeFile(
        path.join(process.cwd(), 'storage', filename),
        file.buffer,
      );
    } catch (error) {
      Logger.log(error);
    }

    const user: UserEntity = await this.userService.findOneUser(userId);

    const post: PostEntity = new PostEntity();
    post.user = user;
    post.title = sanitizeHtml(createPostDto.title);
    post.description = sanitizeHtml(createPostDto.description);
    post.category = sanitizeHtml(createPostDto.category);
    post.img = filename;
    await this.postRepository.save(post);

    return {
      message: `post created`,
      statusCode: 201,
    };
  }

  async findAllPostsFiltered(): Promise<PostResponse[]> {
    const posts: PostEntity[] = await this.postRepository.find({
      relations: {
        user: {
          role: true,
        },
      },
    });
    return posts.map((post: PostEntity) => this.filter(post));
  }

  async findOnePostFiltered(id: string): Promise<PostResponse> {
    const user: PostEntity = await this.postRepository.findOne({
      where: { id },
      relations: {
        user: {
          role: true,
        },
      },
    });
    return this.filter(user);
  }

  async findOnePost(id: string): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: { id },
      relations: {
        user: {
          role: true,
        },
      },
    });
  }

  async update(
    post: PostResponse | PostEntity,
    file: Express.Multer.File,
    updatePostDto: UpdatePostDto,
  ) {
    const filename: string = `${uuid()}.${mime.getExtension(file?.mimetype)}`;

    try {
      await fs.writeFile(
        path.join(process.cwd(), 'storage', filename),
        file.buffer,
      );

      await fs.unlink(path.join(process.cwd(), 'storage', post.img));
    } catch (error) {
      Logger.log(error);
    }

    await this.postRepository.update(
      { id: post.id },
      {
        title: sanitizeHtml(updatePostDto.title),
        description: sanitizeHtml(updatePostDto.description),
        img: file ? filename : post.img,
        category: sanitizeHtml(updatePostDto.category),
      },
    );

    return {
      message: `post ${post.title} updated`,
      statusCode: 201,
    };
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    const post: PostEntity = await this.findOnePost(id);

    if (!post) {
      throw new ForbiddenException('There is no post with that id');
    }

    if (post.user.id === userId) {
      throw new ConflictException(
        'You can only edit posts of which you are the author',
      );
    }

    return await this.update(post, file, updatePostDto);
  }

  async removePost(id: string, userId: string) {
    const post: PostEntity = await this.findOnePost(id);

    if (post.user.id === userId) {
      throw new ConflictException(
        'You can only delete posts of which you are the author',
      );
    }

    return await this.postRepository.delete({ id });
  }

  getFile(filename: string): StreamableFile {
    const file: ReadStream = createReadStream(
      path.join(process.cwd(), 'storage', `${filename}`),
    );
    return new StreamableFile(file);
  }
}
