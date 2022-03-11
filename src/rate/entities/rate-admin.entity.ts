import { AdminEntity } from 'nestjs-admin';
import { Rate } from './rate.entity';

/**
 * @ignore
 */
export class RateAdmin extends AdminEntity {
  entity = Rate;
  searchFields = ['id'];
}
