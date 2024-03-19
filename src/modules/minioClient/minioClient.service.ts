import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  constructor(private minioService: MinioService) {}

  async createBucket(name: string) {
    await this.minioService.client.makeBucket(name);
    return;
  }

  async deleteBucket(name: string) {
    await this.minioService.client.removeBucket(name);
    return;
  }

  async uploadFile(file: Express.Multer.File, bucketName: string) {
    const metaData = {
      'Content-Type': file.mimetype,
    };

    const { etag } = await this.minioService.client.putObject(
      bucketName,
      file.originalname,
      file.buffer,
      metaData,
    );

    return etag;
  }

  async deleteFiles(bucketName: string, objectsList: string[]) {
    await this.minioService.client.removeObjects(bucketName, objectsList);
    return;
  }

  async getFileStream(bucketName: string, objectName: string) {
    return await this.minioService.client.getObject(bucketName, objectName);
  }
}
