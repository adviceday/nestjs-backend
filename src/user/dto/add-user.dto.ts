import { authMethod } from '../entities/user.entity';

/**
 * Dto for adding user
 * not belongs to controller, but for service
 */
export class AddUserDto {
  /**
   * Email of future user
   */
  email: string;
  /**
   * Password of future user
   */
  password: string;
  /**
   * Auth method for example: local;google;facebook
   * @link authMethod
   */
  authMethod: authMethod;
}
