import { Module } from '@nestjs/common';
import { UserSharedModule } from './shared/user-shared.module';
import { UserService } from './shared/services/user.service';

@Module({
  imports: [UserSharedModule],
  providers: [UserService],
})
export class UserModule {}
