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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { UpdatePostDto } from '../dto';
import { UseRole } from '../../auth/decorators';
import { DeleteResult } from 'typeorm';
import { Role } from '../../types';
import { AdminPostService } from '../services';

@ApiTags('admin/post')
@UseRole(Role.admin)
@Controller('admin/post')
export class AdminPostController {
  constructor(private readonly adminPostService: AdminPostService) {}

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'update selected post',
    description: 'Admin can update selected post',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiBody({
    description: 'post update data',
    type: UpdatePostDto,
  })
  @ApiConsumes('multipart/form-data')
  async updatePost(
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
    return await this.adminPostService.updatePost(id, updatePostDto, file);
  }

  @Delete(':id')
  async removePost(@Param('id') id: string): Promise<DeleteResult> {
    return await this.adminPostService.removePost(id);
  }
}
