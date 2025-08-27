# Employee Attendance App - Microservices Architecture

A scalable employee attendance management system built with microservices architecture using NestJS, TypeScript, and PostgreSQL.

## Architecture Overview

The application is split into 4 main services:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   API Gateway   │    │   Auth Service   │    │  Employee Service   │
│   Port: 3000    │────│   Port: 3001     │────│   Port: 3002        │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                                               │
         │              ┌─────────────────────┐         │
         └──────────────│ Attendance Service  │─────────┘
                        │   Port: 3003        │
                        └─────────────────────┘
```

## Services

### 1. API Gateway (Port 3000)

- **Purpose**: Single entry point for all client requests
- **Features**:
  - Request routing to appropriate services
  - Authentication middleware
  - CORS handling
  - Request/Response transformation

### 2. Auth Service (Port 3001)

- **Purpose**: Authentication and user management
- **Database**: `auth_service` (PostgreSQL)
- **Features**:
  - User registration/login
  - JWT token generation and validation
  - Role-based access control
  - Token validation endpoint for other services

### 3. Employee Service (Port 3002)

- **Purpose**: Employee profile management
- **Database**: `employee_service` (PostgreSQL)
- **Features**:
  - Employee CRUD operations
  - Profile photo management
  - Employee information storage

### 4. Attendance Service (Port 3003)

- **Purpose**: Attendance tracking and reporting
- **Database**: `attendance_service` (PostgreSQL)
- **Features**:
  - Clock in/out functionality
  - Attendance history
  - Hours calculation
  - Attendance reports

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

1. **Start all services**:

   ```bash
   docker-compose up -d
   ```

2. **View logs**:

   ```bash
   docker-compose logs -f
   ```

3. **Stop all services**:
   ```bash
   docker-compose down
   ```

### Service URLs

- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Employee Service**: http://localhost:3002
- **Attendance Service**: http://localhost:3003

## API Endpoints

All requests go through the API Gateway at `http://localhost:3000`

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - Register new user (Admin only)
- `POST /auth/logout` - Logout

### Employee Management

- `GET /employees` - Get all employees
- `GET /employees/profile` - Get current user profile
- `GET /employees/:id` - Get employee by ID
- `PUT /employees/profile` - Update current user profile
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Deactivate employee

### Attendance

- `POST /attendance/clock-in` - Clock in
- `POST /attendance/clock-out` - Clock out
- `GET /attendance/status` - Get current attendance status
- `GET /attendance/my-records` - Get user's attendance records
- `GET /attendance` - Get all attendance records
- `GET /attendance/employee/:id` - Get attendance by employee
- `GET /attendance/:id` - Get attendance record by ID

## 🔒 Role-Based Access Control

### Admin Role

**Full System Access:**

- Create, read, update, and delete employees
- View all attendance records across all employees
- Clock in/out on behalf of any employee
- Access all administrative endpoints

### Employee Role

**Limited Access:**

- View and update only their own profile
- Upload/delete only their own profile photo
- Clock in/out for themselves only
- View only their own attendance records
- Cannot access other employees' data

### Authentication Requirements

All endpoints require valid JWT authentication except:

- `POST /auth/login`
- Health check endpoints (`/health`)

### Authorization Implementation

- **Employee Service**: Uses `@Roles(Role.ADMIN)` for admin-only endpoints
- **Attendance Service**: Uses `@Roles(Role.ADMIN)` for admin-only endpoints
- **Context-Aware**: Employees automatically restricted to their own data
- **JWT Validation**: Each service independently validates JWT tokens

## Development Setup

### Running Individual Services

1. **Auth Service**:

   ```bash
   cd services/auth-service
   npm install
   npm run start:dev
   ```

2. **Employee Service**:

   ```bash
   cd services/employee-service
   npm install
   npm run start:dev
   ```

3. **Attendance Service**:

   ```bash
   cd services/attendance-service
   npm install
   npm run start:dev
   ```

4. **API Gateway**:
   ```bash
   cd services/api-gateway
   npm install
   npm run start:dev
   ```

### Environment Variables

Create `.env` files in each service directory:

**Auth Service** (`.env`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=auth_service
JWT_SECRET=default-secret
JWT_EXPIRES_IN=7d
PORT=3001
```

**Employee Service** (`.env`):

```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=employee_service
PORT=3002
```

**Attendance Service** (`.env`):

```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=attendance_service
PORT=3003
```

**API Gateway** (`.env`):

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
EMPLOYEE_SERVICE_URL=http://localhost:3002
ATTENDANCE_SERVICE_URL=http://localhost:3003
```

## Inter-Service Communication

### Authentication Flow

1. Client sends request to API Gateway
2. API Gateway validates JWT token with Auth Service
3. If valid, request is forwarded to appropriate service
4. Response is returned through API Gateway

### Data Flow Example (Clock In)

1. `POST /attendance/clock-in` → API Gateway
2. API Gateway validates token with Auth Service
3. API Gateway forwards request to Attendance Service
4. Attendance Service processes clock-in
5. Response flows back through API Gateway to client

## Database Schema

### Auth Service - Users Table

- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `role` (admin/employee)
- `isActive`
- `createdAt`
- `updatedAt`

### Employee Service - Employees Table

- `id` (UUID, Primary Key - matches User ID)
- `email`
- `firstName`
- `lastName`
- `phoneNumber`
- `department`
- `position`
- `hireDate`
- `profilePhotoUrl`
- `profilePhotoFilename`
- `isActive`
- `createdAt`
- `updatedAt`

### Attendance Service - Attendances Table

- `id` (UUID, Primary Key)
- `employeeId` (UUID, Foreign Key)
- `clockInTime`
- `clockOutTime`
- `status` (clocked_in/clocked_out)
- `hoursWorked`
- `notes`
- `createdAt`

## Benefits of Microservices Architecture

1. **Scalability**: Each service can be scaled independently
2. **Technology Diversity**: Services can use different technologies
3. **Fault Isolation**: Failure in one service doesn't affect others
4. **Team Autonomy**: Different teams can work on different services
5. **Deployment Independence**: Services can be deployed independently

## Monitoring and Health Checks

Each service exposes health check endpoints:

- Auth Service: `GET http://localhost:3001/health`
- Employee Service: `GET http://localhost:3002/health`
- Attendance Service: `GET http://localhost:3003/health`
- API Gateway: `GET http://localhost:3000/health`

## Security

- JWT tokens for authentication
- Role-based access control
- Password hashing with bcrypt
- CORS enabled
- Input validation on all endpoints

## Future Enhancements

- Service mesh (Istio)
- Message queues (RabbitMQ/Apache Kafka)
- Distributed tracing (Jaeger)
- Centralized logging (ELK Stack)
- API rate limiting
- Circuit breakers
- Event sourcing
- CQRS pattern

## Troubleshooting

### Common Issues

1. **Service not starting**: Check database connections and environment variables
2. **Authentication failing**: Verify JWT_SECRET is consistent across services
3. **Inter-service communication issues**: Check service URLs in environment variables

### Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs auth-service
docker-compose logs employee-service
docker-compose logs attendance-service
docker-compose logs api-gateway
```

## Contributing

1. Each service follows NestJS best practices
2. Use TypeScript strict mode
3. Add proper error handling
4. Write unit tests for services
5. Update API documentation when adding endpoints
