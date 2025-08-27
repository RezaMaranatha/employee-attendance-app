# Attendance Management System

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/RezaMaranatha/employee-attendance-app.git
   cd attendance-app
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - **Employee Portal**: http://localhost:3004
   - **Admin Dashboard**: http://localhost:3005
   - **API Gateway**: http://localhost:3000
   - **Logging Service**: http://localhost:3006

### Step-by-Step Startup (Recommended for Troubleshooting)

1. **Start databases and Kafka first**
   ```bash
   docker-compose up -d postgres logging-postgres kafka kafka-setup
   ```

2. **Wait 30 seconds for databases to be ready, then start backend services**
   ```bash
   docker-compose up -d auth-service employee-service attendance-service api-gateway
   ```

3. **Start frontend applications**
   ```bash
   docker-compose up -d frontend admin-frontend
   ```

4. **Start logging service**
   ```bash
   docker-compose up -d logging-service
   ```

### Local Development

1. **Start the databases and Kafka**
   ```bash
   docker-compose up -d postgres logging-postgres kafka
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

   # Logging Service
   cd services/logging-service && npm run start:dev
   ```

3. **Start frontend applications** (in separate terminals)
   ```bash
   # Employee Frontend
   cd frontend && npm start

   # Admin Frontend
   cd admin-frontend && npm start
   ```


## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

```env
# Main Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=attendance_app

# Logging Database
DB_HOST=logging-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=logging_db

# JWT
JWT_SECRET=default-secret
JWT_EXPIRES_IN=7d

# Kafka
KAFKA_BROKERS=kafka:9092

# Service URLs
AUTH_SERVICE_URL=http://auth-service:3001
EMPLOYEE_SERVICE_URL=http://employee-service:3002
ATTENDANCE_SERVICE_URL=http://attendance-service:3003
```






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
│   ├── attendance-service/  # Attendance service
│   └── logging-service/     # Logging service
└── docker-compose.yml       # Docker configuration
```


## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | Main database |
| logging-postgres | 5433 | Logging database |
| kafka | 9092 | Message queue |
| api-gateway | 3000 | API Gateway |
| auth-service | 3001 | Authentication |
| user-service | 3002 | User Management |
| attendance-service | 3003 | Attendance |
| logging-service | 3006 | Logging service |
| frontend | 3004 | Employee Portal |
| admin-frontend | 3005 | Admin Dashboard |

## 🔄 Kafka Integration

The system uses Kafka for event-driven communication:

### Topics
- `user-data-changes` - User creation, updates, and deletion events

### Events
- `USER_CREATED` - When a new user is registered
- `USER_UPDATED` - When user data is modified
- `USER_DELETED` - When a user is deactivated

### Services
- **Producers**: Auth Service, User Service
- **Consumer**: Logging Service

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000-3006, 5432-5433, and 9092 are available
2. **Database connection**: Wait for PostgreSQL instances to fully start before starting services
3. **Kafka connection**: Ensure Kafka is running before starting services that depend on it
4. **CORS issues**: Frontend is configured to connect to API Gateway at localhost:3000
5. For simplicity purposes i pushed the env vars to github

