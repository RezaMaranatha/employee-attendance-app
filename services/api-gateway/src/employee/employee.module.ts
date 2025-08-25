import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [HttpModule],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
