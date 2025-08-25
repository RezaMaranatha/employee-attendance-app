import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AttendanceModule } from './attendance/attendance.module';
import { HealthController } from './health/health.controller';
import { Attendance } from './attendance/entities/attendance.entity';
import { JwtStrategy } from './utils/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '24h' },
    }),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'attendance_service',
      entities: [Attendance],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AttendanceModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule {}
