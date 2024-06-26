import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule, File } from '../files';
import { UsersModule, User } from '../users';
import { AuthModule } from '../auth';
import { LoggerModule } from '../logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    AuthModule,
    UsersModule,
    FilesModule,
    LoggerModule,
  ],
})
export class AppModule {}
