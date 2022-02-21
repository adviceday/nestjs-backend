import { Module } from '@nestjs/common';
import { AdviceService } from './services/advice.service';
import { AdviceController } from './advice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdviceRepository } from './repositories/advice.repository';
import { AdviceAuthorRepository } from './repositories/advice-author.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([AdviceRepository, AdviceAuthorRepository]),
  ],
  controllers: [AdviceController],
  providers: [AdviceService],
})
export class AdviceModule {}
