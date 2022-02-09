import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../../user/shared/services/user.service';
import { UserSharedModule } from '../../user/shared/user-shared.module';

@Module({
  imports: [JwtModule.register({}), UserSharedModule],
  providers: [AuthService, UserService],
  exports: [AuthService, JwtModule],
})
export class AuthSharedModule {}
