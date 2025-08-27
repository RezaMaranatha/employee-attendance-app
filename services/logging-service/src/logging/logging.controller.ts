import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggingService } from './logging.service';

export interface UserChangeEvent {
  eventType: 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED';
  userId: string;
  userData: any;
  changedBy?: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

@Controller()
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @MessagePattern('user-data-changes')
  async handleUserDataChange(@Payload() data: UserChangeEvent) {
    console.log('🎉 RECEIVED KAFKA MESSAGE!');
    console.log('Topic: user-data-changes');
    console.log('Data:', JSON.stringify(data, null, 2));

    try {
      await this.loggingService.logUserChange(data);
      console.log('Message processed successfully');
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}
