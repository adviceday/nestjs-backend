import { AdminEntity } from 'nestjs-admin';
import { Advice } from './advice.entity';

/**
 * @ignore
 */
export class AdviceAdmin extends AdminEntity {
  entity = Advice;
  searchFields = ['id'];
}
