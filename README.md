# Attendance Management System

A full-stack attendance management application with separate frontends for employees and administrators.

## 🏗️ Architecture

- **Frontend (Employee Portal)**: React app for employees to clock in/out
- **Admin Frontend**: React app for administrators to manage employees and monitor attendance
- **API Gateway**: NestJS service that routes requests to microservices
- **Auth Service**: Handles authentication and user management
- **User Service**: Manages employee data and profiles
- **Attendance Service**: Handles attendance records and time tracking
- **Database**: Single PostgreSQL database shared across all services

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-app
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications**
   - **Employee Portal**: http://localhost:3004
   - **Admin Dashboard**: http://localhost:3005
   - **API Gateway**: http://localhost:3000

### Local Development

1. **Start the database**
   ```bash
   docker-compose up postgres
   ```

2. **Start backend services** (in separate terminals)
   ```bash
   # API Gateway
   cd services/api-gateway && npm run start:dev

   # Auth Service
   cd services/auth-service && npm run start:dev

   # User Service
   cd services/user-service && npm run start:dev

   # Attendance Service
   cd services/attendance-service && npm run start:dev
   ```

3. **Start frontend applications** (in separate terminals)
   ```bash
   # Employee Frontend
   cd frontend && npm start

   # Admin Frontend
   cd admin-frontend && npm start
   ```

## 📱 Applications

### Employee Portal (Port 3004)
- Clock in/out functionality
- View attendance history
- Profile management
- Real-time status updates

### Admin Dashboard (Port 3005)
- Employee management (CRUD operations)
- Attendance monitoring
- User registration (admin only)
- System overview

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=attendance_app

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Service URLs
AUTH_SERVICE_URL=http://auth-service:3001
EMPLOYEE_SERVICE_URL=http://employee-service:3002
ATTENDANCE_SERVICE_URL=http://attendance-service:3003
```

### Default Admin Account

When running for the first time, you'll need to create an admin account. The default password for new users is `password`.

## 🗄️ Database

The application uses a single PostgreSQL database with the following main tables:

- `users` - Employee and admin user accounts
- `attendances` - Attendance records and time tracking

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Admin/Employee)
- Token validation on protected routes
- Automatic token refresh

## 📊 Features

### Employee Features
- ✅ Clock in/out
- ✅ View attendance history
- ✅ Profile management
- ✅ Real-time status

### Admin Features
- ✅ Employee management
- ✅ Attendance monitoring
- ✅ User registration
- ✅ System administration

## 🛠️ Development

### Project Structure
```
attendance-app/
├── frontend/                 # Employee portal
├── admin-frontend/          # Admin dashboard
├── services/
│   ├── api-gateway/         # API Gateway service
│   ├── auth-service/        # Authentication service
│   ├── user-service/        # User management service
│   └── attendance-service/  # Attendance service
└── docker-compose.yml       # Docker configuration
```

### Available Scripts

**Backend Services:**
```bash
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start        # Production mode
```

**Frontend Applications:**
```bash
npm start           # Development server
npm run build       # Build for production
npm test            # Run tests
```

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | Database |
| api-gateway | 3000 | API Gateway |
| auth-service | 3001 | Authentication |
| user-service | 3002 | User Management |
| attendance-service | 3003 | Attendance |
| frontend | 3004 | Employee Portal |
| admin-frontend | 3005 | Admin Dashboard |

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000-3005 and 5432 are available
2. **Database connection**: Wait for PostgreSQL to fully start before starting services
3. **CORS issues**: Frontend is configured to connect to API Gateway at localhost:3000

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs auth-service
docker-compose logs frontend
```

## 📝 License

This project is licensed under the MIT License.
