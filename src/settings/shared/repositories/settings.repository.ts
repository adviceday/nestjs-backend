import { EntityRepository, Repository } from 'typeorm';
import { Settings } from '../../entities/settings.entity';

/**
 * Settings repository
 */
@EntityRepository(Settings)
export class SettingsRepository extends Repository<Settings> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
