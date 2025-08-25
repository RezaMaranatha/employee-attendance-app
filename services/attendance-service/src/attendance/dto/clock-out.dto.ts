import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ClockOutDto {
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
