import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '@my-cloud/modules/files/files.module';
import { UsersModule } from '@my-cloud/modules/users/users.module';
import { User } from '@my-cloud/modules/users/entities/user.entity';
import { File } from '@my-cloud/modules/files/entities/file.entity';

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
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
