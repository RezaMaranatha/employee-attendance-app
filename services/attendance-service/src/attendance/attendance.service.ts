import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async clockIn(clockInDto: ClockInDto): Promise<Attendance> {
    const activeAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId: clockInDto.employeeId,
        status: AttendanceStatus.CLOCKED_IN,
      },
      order: { clockInTime: 'DESC' },
    });
    console.log(activeAttendance);
    if (activeAttendance !== null && activeAttendance !== undefined) {
      throw new BadRequestException('Employee is already clocked in');
    }

    const attendance = this.attendanceRepository.create({
      employeeId: clockInDto.employeeId,
      clockInTime: new Date(),
      status: AttendanceStatus.CLOCKED_IN,
      notes: clockInDto.notes,
    });

    return this.attendanceRepository.save(attendance);
  }

  async clockOut(clockOutDto: ClockOutDto): Promise<Attendance> {
    const activeAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId: clockOutDto.employeeId,
        status: AttendanceStatus.CLOCKED_IN,
      },
      order: { clockInTime: 'DESC' },
    });

    if (!activeAttendance) {
      throw new BadRequestException('Employee is not clocked in');
    }

    const clockOutTime = new Date();
    const hoursWorked = this.calculateHoursWorked(
      activeAttendance.clockInTime,
      clockOutTime,
    );

    activeAttendance.clockOutTime = clockOutTime;
    activeAttendance.status = AttendanceStatus.CLOCKED_OUT;
    activeAttendance.hoursWorked = hoursWorked;

    if (clockOutDto.notes) {
      activeAttendance.notes = activeAttendance.notes
        ? `${activeAttendance.notes}. Clock-out notes: ${clockOutDto.notes}`
        : clockOutDto.notes;
    }

    return this.attendanceRepository.save(activeAttendance);
  }

  async findAll(queryDto: AttendanceQueryDto): Promise<Attendance[]> {
    const query = this.attendanceRepository.createQueryBuilder('attendance');

    if (queryDto.employeeId) {
      query.andWhere('attendance.employeeId = :employeeId', {
        employeeId: queryDto.employeeId,
      });
    }

    if (queryDto.startDate && queryDto.endDate) {
      query.andWhere('attendance.clockInTime BETWEEN :startDate AND :endDate', {
        startDate: queryDto.startDate,
        endDate: queryDto.endDate,
      });
    } else if (queryDto.startDate) {
      query.andWhere('attendance.clockInTime >= :startDate', {
        startDate: queryDto.startDate,
      });
    } else if (queryDto.endDate) {
      query.andWhere('attendance.clockInTime <= :endDate', {
        endDate: queryDto.endDate,
      });
    }

    return query.orderBy('attendance.clockInTime', 'DESC').getMany();
  }

  async findByEmployee(
    employeeId: string,
    queryDto: Partial<AttendanceQueryDto> = {},
  ): Promise<Attendance[]> {
    const whereClause: any = { employeeId };

    if (queryDto.startDate && queryDto.endDate) {
      whereClause.clockInTime = Between(
        new Date(queryDto.startDate),
        new Date(queryDto.endDate),
      );
    } else if (queryDto.startDate) {
      whereClause.clockInTime = Between(
        new Date(queryDto.startDate),
        new Date(),
      );
    } else if (queryDto.endDate) {
      whereClause.clockInTime = Between(
        new Date('1970-01-01'),
        new Date(queryDto.endDate),
      );
    }

    if (queryDto.status) {
      whereClause.status = queryDto.status;
    }

    return this.attendanceRepository.find({
      where: whereClause,
      order: { clockInTime: 'DESC' },
    });
  }

  async findById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  async getCurrentStatus(
    employeeId: string,
  ): Promise<{ isClocked: boolean; attendance?: Attendance }> {
    const activeAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        status: AttendanceStatus.CLOCKED_IN,
      },
      order: { clockInTime: 'DESC' },
    });

    return {
      isClocked: !!activeAttendance,
      attendance: activeAttendance || undefined,
    };
  }

  private calculateHoursWorked(clockInTime: Date, clockOutTime: Date): number {
    const diffInMs = clockOutTime.getTime() - clockInTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * 100) / 100;
  }
}
