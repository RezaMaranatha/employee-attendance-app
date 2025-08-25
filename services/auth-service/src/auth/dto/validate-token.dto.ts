import { IsString, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '../../utils/enums/role.enum';

export class ValidateTokenDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  isActive: boolean;
}
