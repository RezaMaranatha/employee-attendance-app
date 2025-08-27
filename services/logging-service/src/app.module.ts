import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingController } from './logging/logging.controller';
import { LoggingRestController } from './logging/logging-rest.controller';
import { LoggingService } from './logging/logging.service';
import { UserChangeLog } from './entities/user-change-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5433),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'logging_db'),
        entities: [UserChangeLog],
        synchronize: false,
        logging: false,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserChangeLog]),
  ],
  controllers: [LoggingController, LoggingRestController],
  providers: [LoggingService],
})
export class AppModule {}
