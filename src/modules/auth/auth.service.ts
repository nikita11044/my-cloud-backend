import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { User, UsersService, CreateUserDto } from '../users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const { password: passwordHash, ...result } = user;

      const passwordMatched = await bcryptjs.compare(password, passwordHash);

      if (passwordMatched) {
        return result;
      }
    }

    return null;
  }

  async registerUser(dto: CreateUserDto) {
    const { id } = await this.usersService.create(dto);
    return id;
  }

  async login({ id }: User) {
    return this.jwtService.sign({ id });
  }
}
