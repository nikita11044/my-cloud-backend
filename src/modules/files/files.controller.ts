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
  Param,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiCookieAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';
import { UserId } from '../../shared';
import { FileTypes } from './entities';
import { type Response } from 'express';

@Controller('files')
@ApiTags('Files')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll(@UserId() userId: number, @Query('type') fileType: FileTypes) {
    return await this.filesService.findAll(userId, fileType);
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
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return await this.filesService.create(file, userId);
  }

  @Delete()
  async deleteFile(@UserId() userId: string, @Query('ids') ids: string) {
    return await this.filesService.delete(userId, ids);
  }

  @Get('/download/:originalName')
  async downloadFile(
    @UserId() userId: string,
    @Param('originalName') originalName: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { mimetype, stream } = await this.filesService.getFileStream(
      userId,
      originalName,
    );
    res.set({
      'Content-Type': `${mimetype}`,
      'Content-Disposition': `attachment; filename="${originalName}"`,
    });
    return new StreamableFile(stream);
  }
}
