import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Headers,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@/guards/auth.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(AuthGuard)
  @Post('clock-in')
  async clockIn(
    @Request() req,
    @Body() clockInDto: any,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';
    try {
      const payload = { employeeId: req.user.id, ...clockInDto };
      const response = await firstValueFrom(
        this.httpService.post(
          `${attendanceServiceUrl}/attendance/clock-in`,
          payload,
          {
            headers: { authorization: auth },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new InternalServerErrorException(error.response.data.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('clock-out')
  async clockOut(
    @Request() req,
    @Body() clockOutDto: any,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';

    try {
      const payload = { ...clockOutDto, employeeId: req.user.id };
      const response = await firstValueFrom(
        this.httpService.post(
          `${attendanceServiceUrl}/attendance/clock-out`,
          payload,
          {
            headers: { authorization: auth },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  @UseGuards(AuthGuard)
  @Get('status')
  async getCurrentStatus(
    @Request() req,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${attendanceServiceUrl}/attendance/my-status`, {
          headers: { authorization: auth },
        }),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  @UseGuards(AuthGuard)
  @Get('my-records')
  async getMyAttendance(
    @Request() req,
    @Query() queryDto: any,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${attendanceServiceUrl}/attendance/my-attendance`,
          {
            params: queryDto,
            headers: { authorization: auth },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query() queryDto: any,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${attendanceServiceUrl}/attendance`, {
          params: queryDto,
          headers: { authorization: auth },
        }),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  @UseGuards(AuthGuard)
  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query() queryDto: any,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${attendanceServiceUrl}/attendance/employee/${employeeId}`,
          {
            params: queryDto,
            headers: { authorization: auth },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    const attendanceServiceUrl =
      process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003';

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${attendanceServiceUrl}/attendance/${id}`, {
          headers: { authorization: auth },
        }),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }
}
