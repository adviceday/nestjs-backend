import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

/**
 * Category repository
 */
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
