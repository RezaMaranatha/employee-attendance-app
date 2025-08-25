import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ClockInDto {
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
