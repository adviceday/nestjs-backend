import { AdminEntity } from 'nestjs-admin';
import { Advice } from './advice.entity';

export class AdviceAdmin extends AdminEntity {
  entity = Advice;
  searchFields = ['id'];
}
