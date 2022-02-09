import { IsEmail, IsNotEmpty } from 'class-validator';

export class LocalSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
