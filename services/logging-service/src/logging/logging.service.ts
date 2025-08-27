import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserChangeEvent } from './logging.controller';
import {
  UserChangeLog,
  UserChangeEventType,
} from '../entities/user-change-log.entity';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(
    @InjectRepository(UserChangeLog)
    private userChangeLogRepository: Repository<UserChangeLog>,
  ) {}

  async logUserChange(event: UserChangeEvent): Promise<void> {
    try {
      this.logger.log(`User ${event.eventType}: ${event.userId}`);

      const logEntry = this.userChangeLogRepository.create({
        eventType: event.eventType as UserChangeEventType,
        userId: event.userId,
        userData: {
          email: event.userData.email,
          firstName: event.userData.firstName,
          lastName: event.userData.lastName,
          role: event.userData.role,
          department: event.userData.department,
          position: event.userData.position,
          phoneNumber: event.userData.phoneNumber,
        },
        changes: event.changes || [],
      });

      await this.userChangeLogRepository.save(logEntry);

      this.logger.log(`✅ User change event saved to database: ${logEntry.id}`);
    } catch (error) {
      this.logger.error('Failed to log user change event:', error);
      throw error;
    }
  }

  async getUserChangeLogs(
    userId?: string,
    eventType?: UserChangeEventType,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ logs: UserChangeLog[]; total: number }> {
    const queryBuilder = this.userChangeLogRepository.createQueryBuilder('log');

    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (eventType) {
      queryBuilder.andWhere('log.eventType = :eventType', { eventType });
    }

    queryBuilder.orderBy('log.createdAt', 'DESC');

    const [logs, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { logs, total };
  }

  async getRecentUserChanges(limit: number = 10): Promise<UserChangeLog[]> {
    return this.userChangeLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
