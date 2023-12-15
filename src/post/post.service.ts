import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { UserService } from '../user/user.service';
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
        path.join(__dirname, '../../storage', filename),
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

    return 'This action adds a new post';
  }

  async findAll() {
    return `This action returns all post`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
