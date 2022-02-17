import { IsIn } from 'class-validator';
import { lang } from '../../lang/types/lang.type';

/**
 * Dto for updating settings
 * include all fields of settings
 * and all they are optional
 * @link Settings
 */
export class UpdateSettingsDto {
  /**
   * Lang of corresponding user
   * @link lang
   */
  @IsIn(['ru', 'en'])
  lang?: lang;
}
