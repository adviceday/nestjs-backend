import { AdminEntity } from 'nestjs-admin';
import { Settings } from './settings.entity';

/**
 * @ignore
 */
export class SettingsAdmin extends AdminEntity {
  entity = Settings;
  searchFields = ['id'];
}
