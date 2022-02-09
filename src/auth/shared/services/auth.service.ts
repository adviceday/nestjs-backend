import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokensResponse } from '../../types/tokens-response.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../../config/env.interface';
import { UserService } from '../../../user/shared/services/user.service';
import { LocalSignupDto } from '../../dto/local-signup.dto';
import { LocalSigninDto } from '../../dto/local-signin.dto';
import { User } from '../../../user/entities/user.entity';

@Injectable()
/**
 * Auth Service
 */
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Env>,
    private userService: UserService,
  ) {}

  /**
   * Create user in database then
   * generate tokens from id and email
   * and update refreshToken in main db
   *
   * @param dto - credentials for signup
   */
  public async signup(dto: LocalSignupDto): Promise<TokensResponse> {
    const user = await this.userService.addUser({
      email: dto.email,
      password: dto.password,
      authMethod: 'local',
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Try to find user with provided email
   * compare his password with hash stored in db record
   * if succeed generates a pair of tokens
   * update hash of refresh token in db record of corresponding user
   * and returns tokens
   *
   * @param dto - signin credentials
   */
  public async signin(dto: LocalSigninDto): Promise<TokensResponse> {
    const user = await this.userService.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isRightPass = await user.validatePassword(dto.password);

    if (!isRightPass) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Logout user from db by deleting refreshToken
   *
   * @param userId - it of user to logout
   */
  public async logout(userId: string): Promise<User> {
    const exist = await this.userService.isUserExists({ id: userId });
    if (!exist) {
      throw new NotFoundException('User is not found');
    }

    return this.userService.removeRefreshToken(userId);
  }

  public async refreshAuth(
    userId: string,
    refreshToken: string,
  ): Promise<TokensResponse> {
    const user = await this.userService.findOne({ id: userId });
    const compareRes = await user.validateRefreshToken(refreshToken);

    if (!compareRes) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * generates a pair of tokens (refresh and access)
   * pass into payload of both userId and email
   *
   * @param userId - id of user to pass in jwt payload
   * @param email - user email to pass in jwt payload
   * @private
   */
  private async getTokens(
    userId: string,
    email: string,
  ): Promise<TokensResponse> {
    const access = this.jwtService.signAsync(
      { sub: userId, email },
      {
        expiresIn: 60 * 60,
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    const refresh = this.jwtService.signAsync(
      { sub: userId, email },
      {
        expiresIn: 60 * 60 * 24 * 14,
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );

    const [token, refreshToken] = await Promise.all([access, refresh]);
    return {
      token,
      refreshToken,
    };
  }
}
