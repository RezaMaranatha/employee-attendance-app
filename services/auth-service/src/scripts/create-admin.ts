import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { Role } from '../shared/enums/role.enum';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  const adminData = {
    email: 'admin@company.com',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: Role.ADMIN,
  };

  try {
    console.log('Creating admin user...');
    const result = await authService.register(adminData);
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log(`👤 Role: ${adminData.role}`);
    console.log(`🎫 JWT Token: ${result.access_token}`);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Admin user already exists!');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }

  await app.close();
}

createAdmin();
