import { Module } from '@nestjs/common';
import { SettingsSharedModule } from './shared/settings-shared.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './shared/services/settings.service';
import { UserSharedModule } from '../user/shared/user-shared.module';

@Module({
  imports: [SettingsSharedModule, UserSharedModule],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
