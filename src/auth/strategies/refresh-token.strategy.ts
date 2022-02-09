import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../config/env.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
/**
 * Strategy to extract and validate refresh token from body
 */
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService<Env>) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  public validate(req: Request, payload: any) {
    return payload;
  }
}
