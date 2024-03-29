import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserModule } from '../user/user.module';
import { AccessSseTokenStrategy } from './strategies/access-token-sse.strategy';

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessSseTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AccessTokenStrategy, RefreshTokenStrategy, AuthService],
})
export class AuthModule {}
