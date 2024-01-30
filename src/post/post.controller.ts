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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public, UseRole, User } from '../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult } from 'typeorm';
import { PostResponse } from 'src/types/post-response';
import { Role } from 'src/types';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async create(
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
  async findAll(): Promise<PostResponse[]> {
    return await this.postService.findAllPostsFiltered();
  }

  @Get('image/:filename')
  @Public()
  @Header('Content-Type', 'image/jpeg')
  getFile(@Param('filename') filename: string): StreamableFile {
    return this.postService.getFile(filename);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostResponse> {
    return await this.postService.findOnePostFiltered(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
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
    return await this.postService.updateByUser(id, updatePostDto, userId, file);
  }

  @Patch('admin-edit/:id')
  @UseRole(Role.admin)
  @UseInterceptors(FileInterceptor('file'))
  async updatePostByAdmin(
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
    return await this.postService.updateByAdmin(id, updatePostDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.postService.remove(id);
  }
}
