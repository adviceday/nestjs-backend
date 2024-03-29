import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';
import { SettingsModule } from '../settings/settings.module';
import { RateModule } from '../rate/rate.module';
import { UserModule } from '../user/user.module';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { CategoryAdmin } from './entities/category-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    SettingsModule,
    UserModule,
    RateModule,
    DefaultAdminModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Advice', CategoryAdmin);
  }
}
