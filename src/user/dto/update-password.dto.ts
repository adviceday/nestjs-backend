import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Dto for updating password
 */
export class UpdatePasswordDto {
  /**
   * Current user password
   */
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  /**
   * Password that want's to be set
   */
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
