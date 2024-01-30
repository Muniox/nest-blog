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
import { PostService } from '../post.service';
import { UpdatePostDto } from '../dto';
import { UseRole } from '../../auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult } from 'typeorm';
import { Role } from 'src/types';

@UseRole(Role.admin)
@Controller('admin/post')
export class AdminPostController {
  constructor(private readonly postService: PostService) {}

  @Patch(':id')
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
