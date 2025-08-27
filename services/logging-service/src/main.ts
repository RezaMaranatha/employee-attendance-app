import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Waiting for Kafka to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          retry: {
            initialRetryTime: 1000,
            retries: 10,
          },
        },
        consumer: {
          groupId: 'logging-service-consumer',
        },
      },
    });

    await app.startAllMicroservices();
    console.log('Kafka microservice started successfully');

    app.enableCors();

    const port = process.env.PORT || 3006;
    await app.listen(port);

    console.log(`Logging service HTTP server running on port ${port}`);
    console.log(
      'Logging service is listening for Kafka messages on topic: user-data-changes',
    );
  } catch (error) {
    console.error('Failed to start logging service:', error);
    process.exit(1);
  }
}
bootstrap();
