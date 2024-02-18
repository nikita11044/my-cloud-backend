import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities';
import { In, Repository } from 'typeorm';
import { MinioClientService } from '../minioClient';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
    private minioClientService: MinioClientService,
  ) {}

  async create(file: Express.Multer.File, userId: string) {
    await this.minioClientService.uploadFile(file, userId);

    return await this.repository.save({
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }

  async delete(userId: string, fileIds: string) {
    const ids = fileIds.split(',');

    const originalNamesQueryResponse = await this.repository
      .createQueryBuilder('file')
      .select('file.originalName')
      .where('id IN (:...ids) AND file.userId = :userId', { ids, userId })
      .getMany();

    const originalNames = originalNamesQueryResponse.map(
      ({ originalName }) => originalName,
    );

    await this.minioClientService.deleteFiles(userId, originalNames);

    await this.repository.delete({ id: In(ids) });

    return;
  }
}
