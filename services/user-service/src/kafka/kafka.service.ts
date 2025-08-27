import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

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

@Injectable()
export class KafkaService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user-service',
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })
  private client: ClientKafka;

  async onModuleInit() {
    await this.client.connect();
  }

  async sendUserChangeEvent(event: UserChangeEvent): Promise<void> {
    try {
      await this.client.emit('user-data-changes', event).toPromise();
      console.log('User change event sent to Kafka:', event.eventType);
    } catch (error) {
      console.error('Failed to send user change event to Kafka:', error);
    }
  }

  async sendUserUpdated(
    userId: string,
    userData: any,
    changes: { field: string; oldValue: any; newValue: any }[],
    changedBy?: string,
  ): Promise<void> {
    const event: UserChangeEvent = {
      eventType: 'USER_UPDATED',
      userId,
      userData,
      changedBy,
      timestamp: new Date().toISOString(),
      changes,
    };
    await this.sendUserChangeEvent(event);
  }

  async sendUserDeleted(userId: string, userData: any, changedBy?: string): Promise<void> {
    const event: UserChangeEvent = {
      eventType: 'USER_DELETED',
      userId,
      userData,
      changedBy,
      timestamp: new Date().toISOString(),
    };
    await this.sendUserChangeEvent(event);
  }
}
