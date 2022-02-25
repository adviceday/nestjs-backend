import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalSignupDto } from './dto/local-signup.dto';
import { LocalSigninDto } from './dto/local-signin.dto';
import { TokensResponse } from './types/tokens-response.type';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { OkResponse } from '../types/ok-response.type';

/**
 * Search for documentation in postman
 * @ignore
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(@Body() body: LocalSignupDto): Promise<TokensResponse> {
    return this.authService.signup(body);
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  async signingLocal(@Body() body: LocalSigninDto): Promise<TokensResponse> {
    return this.authService.signin(body);
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser('sub') userId: string): Promise<OkResponse> {
    await this.authService.logout(userId);
    return { message: 'ok' };
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetUser('sub') userId: string,
    @Body('token') refreshToken: string,
  ): Promise<TokensResponse> {
    return this.authService.refreshAuth(userId, refreshToken);
  }
}
