export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  role?: 'admin' | 'employee';
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export enum AttendanceStatus {
  CLOCKED_IN = 'clocked_in',
  CLOCKED_OUT = 'clocked_out',
}

export interface Attendance {
  id: string;
  employeeId: string;
  employee: User;
  clockInTime: string;
  clockOutTime?: string;
  status: AttendanceStatus;
  hoursWorked?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceQuery {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
  department?: string;
}


