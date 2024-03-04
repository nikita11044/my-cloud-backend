import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '../users';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { AuthInputDto } from './dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: AuthInputDto })
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('/register')
  register(@Body() dto: AuthInputDto) {
    return this.authService.registerUser(dto);
  }
}
