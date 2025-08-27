export interface User {
  profilePhotoFilename?: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  position?: string;
  role: 'admin' | 'employee';
}

export enum AttendanceStatus {
  CLOCKED_IN = 'clocked_in',
  CLOCKED_OUT = 'clocked_out',
}

export interface Attendance {
  id: string;
  employeeId: string;
  clockInTime: string;
  clockOutTime?: string;
  status: AttendanceStatus;
  hoursWorked?: number;
  notes?: string;
  createdAt: string;
}

export interface ClockInRequest {
  notes?: string;
}

export interface ClockOutRequest {
  notes?: string;
}

export interface AttendanceQuery {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

export interface AttendanceStatusResponse {
  isClocked: boolean;
  attendance?: Attendance;
}
