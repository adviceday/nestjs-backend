import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './services/settings.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsRepository } from './repositories/settings.repository';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { Settings } from './entities/settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingsRepository]),
    UserModule,
    DefaultAdminModule,
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', Settings);
  }
}
