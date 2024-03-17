import {
  Controller,
  Post,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
  Delete,
  UseInterceptors,
  UseGuards,
  Get,
  ParseFilePipeBuilder, BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiCookieAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';
import { UserId } from '../../shared';
import { FileTypes } from './entities';

@Controller('files')
@ApiTags('Files')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@UserId() userId: number, @Query('type') fileType: FileTypes) {
    return this.filesService.findAll(userId, fileType);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return this.filesService.create(file, userId);
  }

  @Delete()
  deleteFile(@UserId() userId: string, @Query('ids') ids: string) {
    return this.filesService.delete(userId, ids);
  }
}
