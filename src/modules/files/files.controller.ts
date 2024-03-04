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
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';

@Controller('files')
@ApiTags('Files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    @Query('userId') userId: string,
  ) {
    return this.filesService.create(file, userId);
  }

  @Delete()
  deleteFile(@Query('userId') userId: string, @Query('ids') ids: string) {
    return this.filesService.delete(userId, ids);
  }
}
