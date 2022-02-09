import { authMethod } from '../entities/user.entity';

export class AddUserDto {
  email: string;
  password: string;
  authMethod: authMethod;
}
