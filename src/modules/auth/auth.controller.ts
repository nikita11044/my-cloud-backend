import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto, User } from '../users';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: CreateUserDto })
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
  }
}
