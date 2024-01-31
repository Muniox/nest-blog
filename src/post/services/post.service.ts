import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { PostEntity } from '../entities';
import { UserService } from '../../user/services';
import { createReadStream, ReadStream } from 'fs';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserEntity } from '../../user/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostResponse } from '../../types';

// TODO: sanitize description using dompurify (https://www.npmjs.com/package/dompurify)
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
    const { role, email } = user;
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
        email,
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
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.category = createPostDto.category;
    post.img = filename;
    await this.postRepository.save(post);

    return {
      message: `post ${post.title} added`,
      statusCode: 201,
    };
  }

  async findAllPostsFiltered(): Promise<PostResponse[]> {
    const posts = await this.postRepository.find({
      relations: {
        user: {
          role: true,
        },
      },
    });
    return posts.map((post) => this.filter(post));
  }

  async findOnePostFiltered(id: string): Promise<PostResponse> {
    const user = await this.postRepository.findOne({
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
    const user = await this.postRepository.findOne({
      where: { id },
      relations: {
        user: {
          role: true,
        },
      },
    });
    return user;
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
        title: updatePostDto.title,
        description: updatePostDto.description,
        img: file ? filename : post.img,
        category: updatePostDto.category,
      },
    );

    return {
      message: `post ${post.title} updated`,
      statusCode: 201,
    };
  }

  async updatePostByUser(
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

  async removePostByUser(id: string, userId: string) {
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