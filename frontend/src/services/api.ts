import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Attendance,
  ClockInRequest,
  ClockOutRequest,
  AttendanceQuery,
  AttendanceStatusResponse,
  User,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      '/auth/login',
      credentials,
    );
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      '/auth/register',
      userData,
    );
    return response.data;
  }

  async validateToken(): Promise<User> {
    const response = await this.api.get('/auth/validate-token');
    return response.data;
  }

  // Attendance endpoints
  async clockIn(data: ClockInRequest): Promise<Attendance> {
    const response = await this.api.post<Attendance>(
      '/attendance/clock-in',
      data,
    );
    return response.data;
  }

  async clockOut(data: ClockOutRequest): Promise<Attendance> {
    const response = await this.api.post<Attendance>(
      '/attendance/clock-out',
      data,
    );
    return response.data;
  }

  async getAttendanceStatus(): Promise<AttendanceStatusResponse> {
    const response = await this.api.get<AttendanceStatusResponse>(
      '/attendance/status',
    );
    return response.data;
  }

  async getMyAttendance(query?: AttendanceQuery): Promise<Attendance[]> {
    const response = await this.api.get<Attendance[]>(
      '/attendance/my-records',
      {
        params: query,
      },
    );
    return response.data;
  }

  async getAllAttendance(query?: AttendanceQuery): Promise<Attendance[]> {
    const response = await this.api.get<Attendance[]>('/attendance', {
      params: query,
    });
    return response.data;
  }

  async getAttendanceByEmployee(
    employeeId: string,
    query?: AttendanceQuery,
  ): Promise<Attendance[]> {
    const response = await this.api.get<Attendance[]>(
      `/attendance/employee/${employeeId}`,
      {
        params: query,
      },
    );
    return response.data;
  }

  async getAttendanceById(id: string): Promise<Attendance> {
    const response = await this.api.get<Attendance>(`/attendance/${id}`);
    return response.data;
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/users/profile');
    return response.data;
  }

  async updateProfile(profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  }): Promise<User> {
    const response = await this.api.put<User>('/users/profile', profileData);
    return response.data;
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await this.api.put<{ message: string }>(
      '/auth/change-password',
      passwordData,
    );
    return response.data;
  }

  async uploadProfilePhoto(formData: FormData): Promise<User> {
    const response = await this.api.post<User>(
      '/users/profile/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  async deleteProfilePhoto(): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(
      '/users/profile/photo',
    );
    return response.data;
  }
}

export const apiService = new ApiService();
