import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getHealth() {
    const services = {
      'auth-service': process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      'employee-service': process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002',
      'attendance-service': process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3003',
    };

    const healthChecks = await Promise.allSettled(
      Object.entries(services).map(async ([name, url]) => {
        try {
          const response = await firstValueFrom(
            this.httpService.get(`${url}/health`, { timeout: 2000 })
          );
          return { service: name, status: 'healthy', data: response.data };
        } catch (error) {
          return { service: name, status: 'unhealthy', error: error.message };
        }
      })
    );

    const results = healthChecks.map((result, index) => {
      const serviceName = Object.keys(services)[index];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return { service: serviceName, status: 'unhealthy', error: result.reason };
      }
    });

    const allHealthy = results.every(result => result.status === 'healthy');

    return {
      status: allHealthy ? 'ok' : 'degraded',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: results,
    };
  }
}
