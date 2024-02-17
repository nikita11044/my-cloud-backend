import {
  Controller,
  Post,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
  Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  remove(@Query('userId') userId: string, @Query('ids') ids: string) {
    return this.filesService.delete(userId, ids);
  }
}
