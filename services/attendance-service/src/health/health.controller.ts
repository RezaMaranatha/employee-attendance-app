import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'attendance-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
