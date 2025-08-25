import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, Headers, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async create(@Body() createEmployeeDto: any, @Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.post(`${employeeServiceUrl}/employees`, createEmployeeDto, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get()
  async findAll(@Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.get(`${employeeServiceUrl}/employees`, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get('profile')
  async getProfile(@Request() req, @Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.get(`${employeeServiceUrl}/employees/${req.user.id}`, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.get(`${employeeServiceUrl}/employees/${id}`, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateDto: any, @Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.put(`${employeeServiceUrl}/employees/${req.user.id}`, updateDto, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any, @Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.put(`${employeeServiceUrl}/employees/${id}`, updateDto, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Delete(':id')
  async deactivate(@Param('id') id: string, @Headers('authorization') auth: string) {
    const employeeServiceUrl = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.delete(`${employeeServiceUrl}/employees/${id}`, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }
}
