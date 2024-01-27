import {
  ForbiddenException,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { UserService } from '../user/user.service';
import { createReadStream, ReadStream } from 'fs';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserEntity } from '../user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private userService: UserService,
  ) {}
  async create(
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

    const user: UserEntity = await this.userService.findOne(userId);

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

  async findAll(): Promise<PostEntity[]> {
    return await this.postRepository.find();
    //TODO: no author of post!
  }

  async findOne(id: string): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: { id },
      relations: { user: true },
      //TODO: to many information, user with password in respond!
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    //TODO: Error, File is required when partial update!
    const post: PostEntity = await this.findOne(id);

    if (!post) {
      throw new ForbiddenException('There is no post with that id');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only edit your posts');
    }

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
      { id: id },
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

  async remove(id: string): Promise<DeleteResult> {
    return await this.postRepository.delete({ id });
  }

  getFile(filename: string): StreamableFile {
    const file: ReadStream = createReadStream(
      path.join(process.cwd(), 'storage', `${filename}`),
    );
    return new StreamableFile(file);
  }
}
