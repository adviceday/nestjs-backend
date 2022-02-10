import { IsIn } from 'class-validator';
import { settingsLang } from '../entities/settings.entity';

export class UpdateSettingsDto {
  @IsIn(['ru', 'en'])
  lang?: settingsLang;
}
