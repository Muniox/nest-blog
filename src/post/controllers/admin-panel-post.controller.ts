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
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { UpdatePostDto } from '../dto';
import { UseRole } from '../../auth/decorators';
import { DeleteResult } from 'typeorm';
import { Role } from '../../types';
import { AdminPanelPostService } from '../services';

@ApiTags('admin-panel')
@UseRole(Role.admin)
@Controller('admin-panel/post')
export class AdminPanelPostController {
  constructor(private readonly adminPanelPostService: AdminPanelPostService) {}

  @ApiOperation({
    summary: 'update selected post',
    description: 'Admin can update selected post',
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
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
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
    return await this.adminPanelPostService.updatePost(id, updatePostDto, file);
  }

  @ApiOperation({
    summary: 'delete selected post',
    description: 'Admin can delete selected post',
  })
  @ApiOkResponse({ description: 'Selected Post was deleted' })
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
  async removePost(@Param('id') id: string): Promise<DeleteResult> {
    return await this.adminPanelPostService.removePost(id);
  }
}
