import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { RateModule } from '../rate/rate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => RateModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
