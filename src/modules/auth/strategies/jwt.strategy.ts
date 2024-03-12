import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { Request } from 'express';
import { UsersService } from '../../users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  private static extractJWT(req: Request) {
    if (req.cookies && 'token' in req.cookies && req.cookies.token.length) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('No access');
    }

    return {
      id: user.id,
    };
  }
}
