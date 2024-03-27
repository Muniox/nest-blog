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
import { PostResponse, UserATRequestData } from '../../types';
import {
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: 'create post',
    description: 'user can create post',
  })
  @ApiOkResponse({ description: 'Post created' })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiUnprocessableEntityResponse({
    description:
      'Wrong file extension or image size is to large, or file was no attached',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @User(UserATRequestData.sub) userId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
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

  @ApiOperation({
    summary: 'return all posts',
    description: 'user can get all posts',
  })
  @ApiOkResponse({ description: 'return all posts' })
  @Public()
  @Get()
  async findAllPosts(): Promise<PostResponse[]> {
    return await this.postService.findAllPostsFiltered();
  }

  @ApiOperation({
    summary: 'return selected image',
    description: 'user display selected image',
  })
  @ApiOkResponse({ description: 'Return image' })
  @ApiForbiddenResponse({ description: 'not implemented yet' })
  @Public()
  @Header('Content-Type', 'image/jpeg')
  @Get('image/:filename')
  async getFile(@Param('filename') filename: string): Promise<StreamableFile> {
    return await this.postService.getFile(filename);
  }

  @ApiOperation({
    summary: 'return selected post',
    description: 'User can get selected post',
  })
  @ApiOkResponse({ description: 'Return post' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @Public()
  @Get(':id')
  async findOnePost(@Param('id') id: string): Promise<PostResponse> {
    return await this.postService.findOnePostFiltered(id);
  }

  @ApiOperation({
    summary: 'update selected post by author',
    description:
      'The user can update a selected post of which he/she is the author',
  })
  @ApiOkResponse({ description: 'Post was updated' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiUnprocessableEntityResponse({
    description:
      'Wrong file extension or image size is to large, or file was no attached',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @User(UserATRequestData.sub) userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
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

  @ApiOperation({
    summary: 'delete selected post by author',
    description:
      'The user can delete a selected post of which he/she is the author',
  })
  @ApiOkResponse({ description: 'Post was deleted' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Delete(':id')
  async removePostByUser(
    @Param('id') id: string,
    @User(UserATRequestData.sub) userId: string,
  ): Promise<DeleteResult> {
    return await this.postService.removePost(id, userId);
  }
}
