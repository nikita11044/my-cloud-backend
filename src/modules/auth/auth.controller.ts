import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { User, CreateUserDto } from '../users';
import { Response } from 'express';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: CreateUserDto })
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user as User);
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });
    return {};
  }

  @Get('/logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('token', '', { expires: new Date(Date.now()) });
    return {};
  }

  @Post('/register')
  @ApiBody({ type: CreateUserDto })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
  }

  @Get('/isAuthenticated')
  async isAuthenticated(@Request() req) {
    return Boolean(
      req.cookies && 'token' in req.cookies && req.cookies.token.length,
    );
  }
}
