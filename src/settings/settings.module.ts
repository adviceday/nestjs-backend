import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './services/settings.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsRepository } from './repositories/settings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsRepository]), UserModule],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
