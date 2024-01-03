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
import { createReadStream } from 'fs';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PostService {
  constructor(private userService: UserService) {}
  async create(
    createPostDto: CreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const filename = `${uuid()}.${mime.getExtension(file?.mimetype)}`;

    try {
      await fs.writeFile(
        path.join(process.cwd(), 'storage', filename),
        file.buffer,
      );
    } catch (error) {
      Logger.log(error);
    }

    const user = await this.userService.findOne(userId);

    const post = new PostEntity();
    post.user = user;
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.category = createPostDto.category;
    post.img = filename;
    await post.save();

    return {
      message: `post ${post.title} added`,
      statusCode: 201,
    };
  }

  async findAll(): Promise<PostEntity[]> {
    return await PostEntity.find();
  }

  async findOne(id: string): Promise<PostEntity> {
    return await PostEntity.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const post = await this.findOne(id);

    if (!post) {
      throw new ForbiddenException('There is no post with that id');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only edit your posts');
    }

    const filename = `${uuid()}.${mime.getExtension(file?.mimetype)}`;

    try {
      await fs.writeFile(
        path.join(process.cwd(), 'storage', filename),
        file.buffer,
      );

      await fs.unlink(path.join(process.cwd(), 'storage', post.img));
    } catch (error) {
      Logger.log(error);
    }

    await PostEntity.update(
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

  async remove(id: string) {
    return await PostEntity.delete({ id });
  }

  async getFile(filename: string) {
    const file = createReadStream(
      path.join(process.cwd(), 'storage', `${filename}`),
    );
    return new StreamableFile(file);
  }
}
