import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Dto for singing in
 */
export class LocalSigninDto {
  /**
   * email of existing user
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * password of this user
   */
  @IsNotEmpty()
  password: string;
}
