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
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { Advice } from './entities/advice.entity';
import { AdviceAuthor } from './entities/advice-author.entity';

@Module({
  imports: [
    UserModule,
    NotificationsModule,
    CategoryModule,
    TypeOrmModule.forFeature([AdviceRepository, AdviceAuthorRepository]),
    DefaultAdminModule,
  ],
  providers: [AdviceService, AdviceGeneratorService],
  controllers: [AdviceController],
})
export class AdviceModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Advice', Advice);
    adminSite.register('Advice', AdviceAuthor);
  }
}
