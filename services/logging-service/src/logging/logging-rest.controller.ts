import { Controller, Get, Query, Param } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { UserChangeEventType } from '../entities/user-change-log.entity';

@Controller('logs')
export class LoggingRestController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get('user-changes')
  async getUserChangeLogs(
    @Query('userId') userId?: string,
    @Query('eventType') eventType?: UserChangeEventType,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 100;
    const offsetNum = offset ? parseInt(offset) : 0;

    return this.loggingService.getUserChangeLogs(
      userId,
      eventType,
      limitNum,
      offsetNum,
    );
  }

  @Get('user-changes/recent')
  async getRecentUserChanges(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.loggingService.getRecentUserChanges(limitNum);
  }

  @Get('user-changes/user/:userId')
  async getUserChangesByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 100;
    const offsetNum = offset ? parseInt(offset) : 0;

    return this.loggingService.getUserChangeLogs(
      userId,
      undefined,
      limitNum,
      offsetNum,
    );
  }
}
