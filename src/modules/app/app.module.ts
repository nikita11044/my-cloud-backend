import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule, File } from '../files';
import { UsersModule, User } from '../users';
import { MinioModule } from 'nestjs-minio-client';
import { AuthModule } from '../auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, File],
      synchronize: true,
    }),
    MinioModule.register({
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey: 'minio_access_key',
      secretKey: 'minio_secret_key',
    }),
    AuthModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
