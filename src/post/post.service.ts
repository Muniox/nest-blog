import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(private userService: UserService) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.userService.findOne(userId);
    const post = new PostEntity();
    post.user = user;
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.category = createPostDto.category;
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
