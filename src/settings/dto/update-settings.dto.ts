import { IsIn } from 'class-validator';
import { settingsLang } from '../entities/settings.entity';

/**
 * Dto for updating settings
 * include all fields of settings
 * and all they are optional
 * @link Settings
 */
export class UpdateSettingsDto {
  /**
   * Lang of corresponding user
   * @link settingsLang
   */
  @IsIn(['ru', 'en'])
  lang?: settingsLang;
}
