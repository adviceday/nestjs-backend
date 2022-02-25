import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Dto for signing up
 */
export class LocalSignupDto {
  /**
   * email of new user
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * password for new user
   */
  @IsNotEmpty()
  password: string;
}
