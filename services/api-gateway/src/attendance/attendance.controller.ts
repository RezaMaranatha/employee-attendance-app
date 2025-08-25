import { Controller, Get, Post, Param, Body, Query, Headers, Request } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly httpService: HttpService) {}

  @Post('clock-in')
  async clockIn(@Request() req, @Body() clockInDto: any, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const payload = { ...clockInDto, employeeId: req.user.id };
    const response = await firstValueFrom(
      this.httpService.post(`${attendanceServiceUrl}/attendance/clock-in`, payload, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Post('clock-out')
  async clockOut(@Request() req, @Body() clockOutDto: any, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const payload = { ...clockOutDto, employeeId: req.user.id };
    const response = await firstValueFrom(
      this.httpService.post(`${attendanceServiceUrl}/attendance/clock-out`, payload, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get('status')
  async getCurrentStatus(@Request() req, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const response = await firstValueFrom(
      this.httpService.get(`${attendanceServiceUrl}/attendance/status/${req.user.id}`, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get('my-records')
  async getMyAttendance(@Request() req, @Query() queryDto: any, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const response = await firstValueFrom(
      this.httpService.get(`${attendanceServiceUrl}/attendance/employee/${req.user.id}`, {
        params: queryDto,
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get()
  async findAll(@Query() queryDto: any, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const response = await firstValueFrom(
      this.httpService.get(`${attendanceServiceUrl}/attendance`, {
        params: queryDto,
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get('employee/:employeeId')
  async findByEmployee(@Param('employeeId') employeeId: string, @Query() queryDto: any, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const response = await firstValueFrom(
      this.httpService.get(`${attendanceServiceUrl}/attendance/employee/${employeeId}`, {
        params: queryDto,
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('authorization') auth: string) {
    const attendanceServiceUrl = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    const response = await firstValueFrom(
      this.httpService.get(`${attendanceServiceUrl}/attendance/${id}`, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }
}
