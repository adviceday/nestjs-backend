import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../config/env.type';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * Strategy to extract and validate refresh token from body
 * used in /auth/refresh route
 *
 * @link AuthController.refreshToken
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  /**
   * Setting Base jwt strategy
   * @link Strategy
   *
   * @param configService - to get variables from env file
   */
  constructor(private configService: ConfigService<Env>) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * Set req.user in return statement
   * In this case don't use any transformations
   *
   * @param payload - extracted token info
   */
  public validate(payload: JwtPayload) {
    return payload;
  }
}
