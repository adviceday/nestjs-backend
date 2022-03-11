import { AdminEntity } from 'nestjs-admin';
import { Category } from './category.entity';

/**
 * @ignore
 */
export class CategoryAdmin extends AdminEntity {
  entity = Category;
  searchFields = ['id'];
}
