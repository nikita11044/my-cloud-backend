import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
  ) {}

  async create(file: Express.Multer.File, userId: string) {
    return await this.repository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      userId: userId,
    });
  }

  async delete(userId: string, fileIds: string) {
    const ids = fileIds.split(',');

    await this.repository.delete({ id: In(ids) });

    return;
  }
}
