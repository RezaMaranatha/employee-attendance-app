import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { Attendance } from './entities/attendance.entity';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { RolesGuard } from '../utils/guards/roles.guard';
import { Roles } from '../utils/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { AuthenticatedRequest } from '../utils/interfaces/authenticated-request.interface';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(
    @Request() req: AuthenticatedRequest,
    @Body() clockInDto: ClockInDto,
  ): Promise<Attendance> {
    const { user } = req;

    const employeeId =
      user.role === Role.ADMIN && clockInDto.employeeId
        ? clockInDto.employeeId
        : user.id;
    return this.attendanceService.clockIn({ ...clockInDto, employeeId });
  }

  @Post('clock-out')
  async clockOut(
    @Req() req: AuthenticatedRequest,
    @Body() clockOutDto: ClockOutDto,
  ): Promise<Attendance> {
    const { user } = req;
    const employeeId =
      user.role === Role.ADMIN && clockOutDto.employeeId
        ? clockOutDto.employeeId
        : user.id;
    return this.attendanceService.clockOut({ ...clockOutDto, employeeId });
  }

  @Get('my-status')
  async getMyStatus(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ isClocked: boolean; attendance?: Attendance }> {
    const { user } = req;
    return this.attendanceService.getCurrentStatus(user.id);
  }

  @Get('my-attendance')
  async getMyAttendance(
    @Req() req: AuthenticatedRequest,
    @Query() queryDto: AttendanceQueryDto,
  ): Promise<Attendance[]> {
    const { user } = req;
    return this.attendanceService.findByEmployee(user.id, queryDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() queryDto: AttendanceQueryDto): Promise<Attendance[]> {
    return this.attendanceService.findAll(queryDto);
  }

  @Get('status/:employeeId')
  @Roles(Role.ADMIN)
  async getCurrentStatus(
    @Param('employeeId') employeeId: string,
  ): Promise<{ isClocked: boolean; attendance?: Attendance }> {
    return this.attendanceService.getCurrentStatus(employeeId);
  }

  @Get('employee/:employeeId')
  @Roles(Role.ADMIN)
  async findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query() queryDto: AttendanceQueryDto,
  ): Promise<Attendance[]> {
    return this.attendanceService.findByEmployee(employeeId, queryDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<Attendance> {
    return this.attendanceService.findById(id);
  }
}
