import { Module } from '@nestjs/common';
import { UserSharedModule } from './shared/user-shared.module';
import { UserService } from './shared/services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [UserSharedModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
