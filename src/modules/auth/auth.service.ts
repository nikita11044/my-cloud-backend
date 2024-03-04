import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInputDto, User, UsersService } from '../users';
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

      const passwordMatched = bcrypt.compare(password, passwordHash);

      if (passwordMatched) {
        return result;
      }
    }

    return null;
  }

  async registerUser(dto: UserInputDto) {
    const { id } = await this.usersService.create(dto);

    return {
      token: this.jwtService.sign({ id }),
    };
  }

  async login(user: User) {
    return {
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
