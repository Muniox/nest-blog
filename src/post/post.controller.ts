import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public, User } from '../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @User('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.postService.create(createPostDto, userId, file);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('image/:filename')
  @Public()
  @Header('Content-Type', 'image/jpeg')
  async getFile(@Param('filename') filename: string): Promise<StreamableFile> {
    return await this.postService.getFile(filename);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @User('sub') userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.postService.update(id, updatePostDto, userId, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postService.remove(id);
  }
}
