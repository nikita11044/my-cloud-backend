import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from '@my-cloud/modules/users/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.repository.findOneBy({
      email,
    });
  }

  async findById(id: string) {
    return await this.repository.findOneBy({
      id,
    });
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new HttpException(`Email already registered`, 400);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.repository.save({ ...dto, password: hashedPassword });
  }

  async update(id: string, dto: UpdateUserDto) {
    return await this.repository.update(id, dto);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
