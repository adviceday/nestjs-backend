import { AdminEntity } from 'nestjs-admin';
import { User } from './user.entity';

/**
 * @ignore
 */
export class UserAdmin extends AdminEntity {
  entity = User;
  searchFields = ['id'];
}
