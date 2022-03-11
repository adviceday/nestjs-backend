import { AdminEntity } from 'nestjs-admin';
import { Settings } from './settings.entity';

export class SettingsAdmin extends AdminEntity {
  entity = Settings;
  searchFields = ['id'];
}
