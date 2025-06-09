import { Role } from '../enums/role.enum';

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly role: Role;
}
