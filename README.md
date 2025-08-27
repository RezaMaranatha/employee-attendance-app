# Employee Attendance App

A comprehensive employee attendance management system built with NestJS, TypeScript, and MySQL.

## Features

- **Authentication & Authorization**

  - Role-based access control (Admin/Employee)
  - Admin-only employee registration
  - JWT-based authentication
  - Secure password hashing with bcrypt

- **Employee Management**

  - Employee profiles with personal information
  - Employee CRUD operations
  - Active/inactive employee status

- **Attendance Tracking**
  - Clock in/out functionality
  - Real-time attendance status
  - Attendance history and reports
  - Automatic hours calculation

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Security**: bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd employee-attendance-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=employee_attendance

   # JWT Configuration
   JWT_SECRET=default-secret
   JWT_EXPIRES_IN=7d

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Create the database**

   ```sql
   CREATE DATABASE employee_attendance;
   ```

5. **Create the initial admin user**

   ```bash
   npm run create-admin
   ```

   This creates an admin user with:

   - Email: `admin@company.com`
   - Password: `admin123`
   - Role: `admin`

6. **Run the application**

   ```bash
   # Development mode with auto-reload
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

## API Endpoints

### Authentication

- **POST** `/auth/register` - Register new employee (Admin only)
- **POST** `/auth/login` - Employee login

### Employee Management

- **GET** `/employees` - Get all employees
- **GET** `/employees/profile` - Get current employee profile
- **GET** `/employees/:id` - Get employee by ID
- **PUT** `/employees/profile` - Update current employee profile
- **PUT** `/employees/:id` - Update employee by ID
- **POST** `/employees/profile/photo` - Upload current employee's profile photo
- **POST** `/employees/:id/photo` - Upload employee's profile photo
- **DELETE** `/employees/profile/photo` - Delete current employee's profile photo
- **DELETE** `/employees/:id/photo` - Delete employee's profile photo
- **DELETE** `/employees/:id` - Deactivate employee

### Attendance

- **POST** `/attendance/clock-in` - Clock in
- **POST** `/attendance/clock-out` - Clock out
- **GET** `/attendance/status` - Get current attendance status
- **GET** `/attendance/my-records` - Get current employee's attendance records
- **GET** `/attendance` - Get all attendance records (with filters)
- **GET** `/attendance/employee/:employeeId` - Get attendance by employee ID
- **GET** `/attendance/:id` - Get attendance record by ID

## API Usage Examples

### Login as Admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "admin123"
  }'
```

### Register Employee (Admin only)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "email": "john.doe@company.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "department": "Engineering",
    "position": "Software Developer",
    "role": "employee"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "password123"
  }'
```

### Clock In (requires authentication)

```bash
curl -X POST http://localhost:3000/attendance/clock-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "notes": "Starting work day"
  }'
```

### Clock Out (requires authentication)

```bash
curl -X POST http://localhost:3000/attendance/clock-out \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "notes": "Ending work day"
  }'
```

### Upload Profile Photo (requires authentication)

```bash
curl -X POST http://localhost:3000/employees/profile/photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@/path/to/your/photo.jpg"
```

### Delete Profile Photo (requires authentication)

```bash
curl -X DELETE http://localhost:3000/employees/profile/photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
src/
├── attendance/
│   ├── dto/                 # Data Transfer Objects
│   ├── entities/           # Database entities
│   ├── attendance.controller.ts
│   ├── attendance.service.ts
│   └── attendance.module.ts
├── auth/
│   ├── dto/                # Authentication DTOs
│   ├── guards/             # Auth guards
│   ├── strategies/         # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── employee/
│   ├── entities/           # Employee entity
│   ├── employee.controller.ts
│   ├── employee.service.ts
│   └── employee.module.ts
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## Development

```bash
# Start development server
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Important Notes

### UUID Primary Keys

All entities now use UUID as primary keys instead of auto-incrementing integers. This provides:

- Better security (non-sequential IDs)
- Distributed system compatibility
- Reduced database coupling

Example employee ID: `550e8400-e29b-41d4-a716-446655440000`

### JWT Payload Structure

JWT tokens now include complete user context:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@company.com",
  "role": "admin",
  "iat": 1640995200,
  "exp": 1641599999
}
```

## Database Schema

### Employees Table

- `id` (Primary Key - UUID)
- `email` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `phoneNumber`
- `department`
- `position`
- `hireDate`
- `profilePhotoUrl`
- `profilePhotoFilename`
- `role` (admin/employee)
- `isActive`
- `createdAt`
- `updatedAt`

### Attendances Table

- `id` (Primary Key - UUID)
- `employeeId` (Foreign Key - UUID)
- `clockInTime`
- `clockOutTime`
- `status` (CLOCKED_IN/CLOCKED_OUT)
- `hoursWorked`
- `notes`
- `createdAt`

## License

This project is licensed under the MIT License.
