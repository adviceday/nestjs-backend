import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../config/env.type';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * Strategy to extract and validate access token from query
 * used for auth sse routes
 */
@Injectable()
export class AccessSseTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-sse',
) {
  /**
   * Setting Base jwt strategy
   * @link Strategy
   *
   * @param configService - to get variables from env file
   */
  constructor(private configService: ConfigService<Env>) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: configService.get('JWT_SECRET'),
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
