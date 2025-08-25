import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AttendanceStatus {
  CLOCKED_IN = 'clocked_in',
  CLOCKED_OUT = 'clocked_out',
}

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  employeeId: string;

  @Column({ type: 'timestamp' })
  clockInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOutTime: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.CLOCKED_IN,
  })
  status: AttendanceStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hoursWorked: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
