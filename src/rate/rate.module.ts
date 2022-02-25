import { forwardRef, Module } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './services/rate.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateRepository } from './repositories/rate.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RateRepository]),
    forwardRef(() => UserModule),
  ],
  providers: [RateService],
  controllers: [RateController],
  exports: [RateService],
})
export class RateModule {}
