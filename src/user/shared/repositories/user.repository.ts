import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

/**
 * User repository
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }
}
