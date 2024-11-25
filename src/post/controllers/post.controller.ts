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
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from '../services';
import {
  ValidationUpdatePostDto,
  ValidationCreatePostDto,
  AutomapperReadPostDto,
} from '../dto';
import { Public, User } from '../../auth/decorators';
import {
  MessageResponse,
  PostResponse,
  UserAaccessTokenRequestData,
} from '../../types';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { FileExistGuard } from '../guards/file-exist.guard';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiCookieAuth()
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
  @ApiBadRequestResponse({ description: 'Provided wrong data' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async createPost(
    @Body() createPostDto: ValidationCreatePostDto,
    @User(UserAaccessTokenRequestData.userId) userId: string,
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
  ): Promise<AutomapperReadPostDto> {
    return await this.postService.createPostMapped(createPostDto, userId, file);
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
  @ApiForbiddenResponse({ description: "File doesn't exist" })
  @UseGuards(new FileExistGuard())
  @Public()
  @SkipThrottle()
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
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @Public()
  @Get(':id')
  async findOnePost(@Param('id') id: string): Promise<PostResponse> {
    return await this.postService.findOnePostFiltered(id);
  }

  @ApiCookieAuth()
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
  @ApiBadRequestResponse({ description: 'Provided wrong data' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @User(UserAaccessTokenRequestData.userId) userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: ValidationUpdatePostDto,
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
  ): Promise<MessageResponse> {
    return await this.postService.updatePost(id, updatePostDto, userId, file);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'delete selected post by author',
    description:
      'The user can delete a selected post of which he/she is the author',
  })
  @ApiNoContentResponse({ description: 'Post was deleted' })
  @ApiForbiddenResponse({
    description:
      "User have no access to this resource or resources don't exist",
  })
  @ApiUnauthorizedResponse({ description: 'User must be logged in' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async removePostByUser(
    @Param('id') id: string,
    @User(UserAaccessTokenRequestData.userId) userId: string,
  ): Promise<void> {
    return await this.postService.removePost(id, userId);
  }
}
