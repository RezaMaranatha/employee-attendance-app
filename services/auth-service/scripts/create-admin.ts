import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { Role } from '../src/utils/enums/role.enum';
import { randomBytes } from 'crypto';

function createAdmin() {
  const secret = randomBytes(32).toString('hex');
  console.log(secret); 
}

createAdmin();