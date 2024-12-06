import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, ReadStream } from 'fs';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sanitizeHtml from 'sanitize-html';

import {
  AutomapperReadPostDto,
  ValidationCreatePostDto,
  ValidationUpdatePostDto,
} from '../dtos';
import { PostEntity } from '../entities';
import { UserEntity } from '../../user/entities';
import { AutomapperCreatePostDto, AutomapperUpdatePostDto } from '../dtos';

import { IUserService, USER_SERVICE_TOKEN } from '../../user/interfaces';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @Inject(USER_SERVICE_TOKEN) private userService: IUserService,
    @InjectMapper() private readonly automapper: Mapper,
  ) {}

  async createPostMapped(
    createPostDto: ValidationCreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<AutomapperReadPostDto> {
    const filename: string = `${uuid()}.${mime.getExtension(file?.mimetype)}`;

    try {
      await fs.writeFile(
        path.join(process.cwd(), 'storage', filename),
        file.buffer,
      );
    } catch (error) {
      Logger.log(error.message);
    }

    const user: UserEntity = await this.userService.findOneUser(userId);

    const post = await this.automapper.mapAsync(
      {
        user,
        title: sanitizeHtml(createPostDto.title),
        description: sanitizeHtml(createPostDto.description),
        category: sanitizeHtml(createPostDto.category),
        img: filename,
      },
      AutomapperCreatePostDto,
      PostEntity,
    );

    return await this.automapper.mapAsync(
      await this.postRepository.save(post),
      PostEntity,
      AutomapperReadPostDto,
    );
  }

  async findAllPostsMapped(): Promise<AutomapperReadPostDto[]> {
    const posts: PostEntity[] = await this.postRepository.find({
      relations: {
        user: {
          role: true,
        },
      },
    });

    // @TODO: jeśli user jest usunięty i post niema przypisanego usera to wyrzuca błąd 500

    return await this.automapper.mapArrayAsync(
      posts,
      PostEntity,
      AutomapperReadPostDto,
    );
  }

  async findOnePostMapped(id: string): Promise<AutomapperReadPostDto> {
    const post: PostEntity = await this.postRepository.findOne({
      where: { id },
      relations: {
        user: {
          role: true,
        },
      },
    });

    // @TODO: jeśli user jest usunięty i post niema przypisanego usera to wyrzuca błąd 500

    if (!post) {
      throw new ForbiddenException(`Post with this id don't exist`);
    }

    return await this.automapper.mapAsync(
      post,
      PostEntity,
      AutomapperReadPostDto,
    );
  }

  async findOnePost(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        user: {
          role: true,
        },
      },
    });

    if (!post) {
      throw new ForbiddenException(`Post with this id don't exist`);
    }

    return post;
  }

  async update(
    post: PostEntity,
    file: Express.Multer.File,
    updatePostDto: ValidationUpdatePostDto,
  ) {
    const filename: string = `${uuid()}.${mime.getExtension(file?.mimetype)}`;

    try {
      await fs.writeFile(
        path.join(process.cwd(), 'storage', filename),
        file.buffer,
      );

      await fs.unlink(path.join(process.cwd(), 'storage', post.img));
    } catch (error) {
      Logger.log(error.message);
    }

    const updatedPost = await this.automapper.mapAsync(
      {
        ...post,
        title: updatePostDto.title
          ? sanitizeHtml(updatePostDto.title)
          : post.title,
        description: updatePostDto.description
          ? sanitizeHtml(updatePostDto.description)
          : post.description,
        img: file ? filename : post.img,
        category: updatePostDto.category
          ? sanitizeHtml(updatePostDto.category)
          : post.category,
      },
      AutomapperUpdatePostDto,
      PostEntity,
    );

    return await this.automapper.mapAsync(
      updatedPost,
      PostEntity,
      AutomapperReadPostDto,
    );

    // await this.postRepository.update(
    //   { id: post.id },
    //   {
    //     title: sanitizeHtml(updatePostDto.title),
    //     description: sanitizeHtml(updatePostDto.description),
    //     img: file ? filename : post.img,
    //     category: sanitizeHtml(updatePostDto.category),
    //   },
    // );

    // return {
    //   message: `post ${post.title} updated`,
    //   statusCode: 201,
    // };
  }

  async updatePost(
    id: string,
    updatePostDto: ValidationUpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<AutomapperReadPostDto> {
    const post: PostEntity = await this.findOnePost(id);

    if (post.user.id !== userId) {
      throw new ConflictException(
        'You can only edit posts of which you are the author',
      );
    }

    return await this.update(post, file, updatePostDto);
  }

  async removePost(id: string, userId: string) {
    const post: PostEntity = await this.findOnePost(id);

    if (post.user.id !== userId) {
      throw new ConflictException(
        'You can only delete posts of which you are the author',
      );
    }

    await this.postRepository.delete({ id });
  }

  async getFile(filename: string): Promise<StreamableFile> {
    const pathFile = path.join(process.cwd(), 'storage', `${filename}`);
    const file: ReadStream = createReadStream(pathFile);

    return new StreamableFile(file);
  }
}
