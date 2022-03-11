import { AdminEntity } from 'nestjs-admin';
import { AdviceAuthor } from './advice-author.entity';

export class AdviceAuthorAdmin extends AdminEntity {
  entity = AdviceAuthor;
  searchFields: ['id'];
}
