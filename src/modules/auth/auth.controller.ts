import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { User, CreateUserDto } from '../users';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: CreateUserDto })
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
  }
}
