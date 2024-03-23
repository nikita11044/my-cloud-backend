import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcryptjs from 'bcryptjs';
import { MinioClientService } from '../minioClient';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private minioClientService: MinioClientService,
  ) {}

  async findByEmail(email: string) {
    return await this.repository.findOneBy({
      email,
    });
  }

  async findById(id: string) {
    const [user] = await this.repository.find({
      where: { id },
      select: { id: true, fullName: true, email: true },
    });

    return user;
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new HttpException(`Email already registered`, 400);
    }

    const hashedPassword = await bcryptjs.hash(dto.password, 10);

    const user = await this.repository.save({
      ...dto,
      password: hashedPassword,
    });
    await this.minioClientService.createBucket(user.id);

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return await this.repository.update(id, dto);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
