import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsRepository } from '../repositories/settings.repository';
import { Settings } from '../../entities/settings.entity';

@Injectable()
/**
 * Settings service
 */
export class SettingsService {
  constructor(
    @InjectRepository(SettingsRepository)
    private settingsRepository: SettingsRepository,
  ) {}

  /**
   * Update settings record
   * Merge existing fields with provided
   *
   * @param settingsId - id of settings that should be updated
   * @param newSettings - fields that need to be merged
   */
  public async updateSettings(
    settingsId: string,
    newSettings: Partial<Settings>,
  ): Promise<Settings> {
    const settings = await this.findOne({ id: settingsId });
    const mergedSettings = this.settingsRepository.merge(settings, newSettings);

    return mergedSettings.save();
  }

  /**
   * Try to find settings record
   * if it's not exist throws error
   *
   * @param settingsFields - fields to search in table
   */
  public async findOne(settingsFields: Partial<Settings>): Promise<Settings> {
    const settings = await this.settingsRepository.findOne(settingsFields);
    if (!settings) {
      throw new NotFoundException('Settings record with this id is not found');
    }

    return settings;
  }
}
