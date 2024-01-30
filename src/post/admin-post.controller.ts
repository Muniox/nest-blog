import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { UseRole } from '../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult } from 'typeorm';
import { Role } from 'src/types';

@Controller('admin/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch(':id')
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
    return await this.postService.removeByAdmin(id);
  }
}
