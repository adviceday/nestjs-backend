import { EntityRepository, Repository } from 'typeorm';
import { Rate } from '../entities/rate.entity';

/**
 * Rate repository
 */
@EntityRepository(Rate)
export class RateRepository extends Repository<Rate> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
