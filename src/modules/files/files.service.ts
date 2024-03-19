import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File, FileTypes } from './entities';
import { In, Repository } from 'typeorm';
import { MinioClientService } from '../minioClient';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
    private minioClientService: MinioClientService,
  ) {}

  async findAll(userId: number, fileType: FileTypes) {
    const qb = this.repository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType === FileTypes.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE :type', { type: '%image%' });
    }

    if (fileType === FileTypes.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return qb.getMany();
  }

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

  async getFileStream(userId: string, originalName: string) {
    const { mimetype } = await this.repository
      .createQueryBuilder('file')
      .select('file.originalName')
      .where('file.userId = :userId', { userId })
      .getOne();
    const stream = await this.minioClientService.getFileStream(
      userId,
      originalName,
    );

    return {
      mimetype,
      stream,
    };
  }
}
