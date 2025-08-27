import { Role } from '@/utils/enums/role.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  department?: string;

  @Expose()
  position?: string;

  @Expose()
  hireDate?: Date;

  @Expose()
  profilePhotoUrl?: string | null;

  @Expose()
  profilePhotoFilename?: string | null;

  @Expose()
  role: Role;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
