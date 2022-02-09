import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthSharedModule } from './shared/auth-shared.module';
import { UserSharedModule } from '../user/shared/user-shared.module';
import { AuthService } from './shared/services/auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [AuthSharedModule, UserSharedModule],
})
export class AuthModule {}
