import { Module } from '@nestjs/common';
import { AdviceService } from './services/advice.service';
import { AdviceController } from './advice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdviceRepository } from './repositories/advice.repository';
import { AdviceAuthorRepository } from './repositories/advice-author.repository';
import { UserModule } from '../user/user.module';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { AdviceAdmin } from './entities/advice-admin.entity';
import { AdviceAuthorAdmin } from './entities/advice-author-admin.entity';
import { AdviceAuthorService } from './services/advice-author.service';
import { AdviceAuthorController } from './advice-author.controller';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([AdviceRepository, AdviceAuthorRepository]),
    DefaultAdminModule,
  ],
  providers: [AdviceService, AdviceAuthorService],
  controllers: [AdviceController, AdviceAuthorController],
  exports: [AdviceService],
})
export class AdviceModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Advice', AdviceAdmin);
    adminSite.register('Advice', AdviceAuthorAdmin);
  }
}
