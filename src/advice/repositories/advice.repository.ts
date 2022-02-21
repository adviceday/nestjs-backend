import { EntityRepository, Repository } from 'typeorm';
import { Advice } from '../entities/advice.entity';

/**
 * Advice repository
 */
@EntityRepository(Advice)
export class AdviceRepository extends Repository<Advice> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
