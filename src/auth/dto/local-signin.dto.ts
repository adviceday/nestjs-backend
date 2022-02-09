import { IsEmail, IsNotEmpty } from 'class-validator';

export class LocalSigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
