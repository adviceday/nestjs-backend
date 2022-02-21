import { EntityRepository, Repository } from 'typeorm';
import { AdviceAuthor } from '../entities/advice-author.entity';

/**
 * Author repository
 */
@EntityRepository(AdviceAuthor)
export class AdviceAuthorRepository extends Repository<AdviceAuthor> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
