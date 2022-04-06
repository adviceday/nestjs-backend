import { EntityRepository, Repository } from 'typeorm';
import { Compilation } from '../entities/compilation.entity';

/**
 * Compilation repository
 */
@EntityRepository(Compilation)
export class CompilationRepository extends Repository<Compilation> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
