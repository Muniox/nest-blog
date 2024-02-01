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
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from '../services';
import { UpdatePostDto, CreatePostDto } from '../dto';
import { Public, User } from '../../auth/decorators';
import { DeleteResult } from 'typeorm';
import { PostResponse } from '../../types';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @User('sub') userId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    return await this.postService.createPostFiltered(
      createPostDto,
      userId,
      file,
    );
  }

  @Get()
  async findAllPosts(): Promise<PostResponse[]> {
    return await this.postService.findAllPostsFiltered();
  }

  @Get('image/:filename')
  @Public()
  @Header('Content-Type', 'image/jpeg')
  getFile(@Param('filename') filename: string): StreamableFile {
    return this.postService.getFile(filename);
  }

  @Get(':id')
  async findOnePost(@Param('id') id: string): Promise<PostResponse> {
    return await this.postService.findOnePostFiltered(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @User('sub') userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1024,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<{ message: string; statusCode: number }> {
    return await this.postService.updatePost(id, updatePostDto, userId, file);
  }

  @Delete(':id')
  async removePostByUser(
    @Param('id') id: string,
    @User('sub') userId: string,
  ): Promise<DeleteResult> {
    return await this.postService.removePost(id, userId);
  }
}
