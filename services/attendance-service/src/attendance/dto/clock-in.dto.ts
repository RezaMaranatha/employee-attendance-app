import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ClockInDto {
  @IsUUID('4')
  employeeId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
