import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@EntityRepository(User)
/**
 * User repository
 */
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }
}
