import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  User,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Attendance,
  AttendanceQuery,
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
      const token = localStorage.getItem('admin_token');
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
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
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

  async validateToken(): Promise<User> {
    const response = await this.api.get('/auth/validate-token');
    return response.data;
  }

  // Employee management endpoints
  async getAllEmployees(): Promise<User[]> {
    const response = await this.api.get<User[]>('/users/findAll');
    return response.data;
  }

  async getEmployeeById(id: string): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<User> {
    const response = await this.api.post<User>('/users', employeeData);
    return response.data;
  }

  async updateEmployee(
    id: string,
    employeeData: UpdateEmployeeRequest,
  ): Promise<User> {
    const response = await this.api.put<User>(`/users/${id}`, employeeData);
    return response.data;
  }

  async deleteEmployee(id: string): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  }

  async uploadEmployeePhoto(id: string, formData: FormData): Promise<User> {
    const response = await this.api.post<User>(`/users/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Attendance monitoring endpoints
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

  // Export endpoints
  async exportAttendanceReport(query?: AttendanceQuery): Promise<Blob> {
    const response = await this.api.get('/attendance/export', {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }

  async exportEmployeeList(): Promise<Blob> {
    const response = await this.api.get('/users/export', {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiService = new ApiService();
