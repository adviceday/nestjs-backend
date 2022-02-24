import { Module } from '@nestjs/common';
import { AdviceService } from './services/advice.service';
import { AdviceController } from './advice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdviceRepository } from './repositories/advice.repository';
import { AdviceAuthorRepository } from './repositories/advice-author.repository';
import { UserModule } from '../user/user.module';
import { AdviceGeneratorService } from './services/advice-generator.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    UserModule,
    NotificationsModule,
    CategoryModule,
    TypeOrmModule.forFeature([AdviceRepository, AdviceAuthorRepository]),
  ],
  providers: [AdviceService, AdviceGeneratorService],
  controllers: [AdviceController],
})
export class AdviceModule {}