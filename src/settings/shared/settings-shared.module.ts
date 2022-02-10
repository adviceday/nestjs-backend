import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsRepository } from './repositories/settings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsRepository])],
  exports: [TypeOrmModule],
})
export class SettingsSharedModule {}
