# Admin Frontend - Attendance Management System

A React-based admin dashboard for monitoring employee attendance and managing the workforce.

## Features

### 🔐 Authentication
- Secure admin login with role-based access control
- JWT token-based authentication
- Automatic token validation and refresh

### 📊 Dashboard Overview
- Real-time attendance statistics
- Employee count and presence tracking
- Department-wise breakdown
- Recent activity feed

### 👥 Employee Management
- View all employees in a searchable table
- Add new employees with complete details
- Edit employee information
- Deactivate/reactivate employees
- Export employee list to CSV

### ⏰ Attendance Monitoring
- View all attendance records
- Filter by date range, employee, and status
- Real-time clock-in/clock-out tracking
- Calculate hours worked
- Export attendance reports

### 📈 Reports & Analytics
- Overview dashboard with key metrics
- Attendance report generation
- Employee directory export
- Department statistics
- Advanced analytics (coming soon)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (attendance-app services)

### Installation

1. Clone the repository and navigate to the admin frontend:
```bash
cd admin-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm start
```

The admin frontend will be available at `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## API Integration

The admin frontend connects to the following backend services:

- **Auth Service**: Authentication and user management
- **User Service**: Employee CRUD operations
- **Attendance Service**: Attendance monitoring and reporting

### Required Backend Endpoints

#### Authentication
- `POST /auth/login` - Admin login
- `GET /auth/validate-token` - Token validation

#### Employee Management
- `GET /users` - Get all employees
- `POST /users` - Create new employee
- `PUT /users/:id` - Update employee
- `DELETE /users/:id` - Delete employee
- `GET /users/export` - Export employee list

#### Attendance Monitoring
- `GET /attendance` - Get all attendance records
- `GET /attendance/dashboard-stats` - Get dashboard statistics
- `GET /attendance/export` - Export attendance report

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── AttendanceMonitoring.tsx
│   ├── DashboardOverview.tsx
│   ├── EmployeeManagement.tsx
│   ├── EmployeeModal.tsx
│   ├── LoginForm.tsx
│   ├── ProtectedRoute.tsx
│   └── Reports.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Security Features

- **Role-based Access Control**: Only admin users can access the dashboard
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Automatic redirection for unauthorized access
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Comprehensive error handling and user feedback

## Usage

### Admin Login
1. Navigate to the login page
2. Enter admin credentials (email and password)
3. The system will validate admin privileges
4. Upon successful authentication, redirect to dashboard

### Managing Employees
1. Navigate to "Employees" section
2. Use search and filters to find specific employees
3. Click "Add Employee" to create new employees
4. Use edit/delete actions for existing employees
5. Export employee list for external use

### Monitoring Attendance
1. Navigate to "Attendance" section
2. Use date filters to view specific periods
3. Filter by employee or status
4. View detailed attendance records
5. Export reports for analysis

### Generating Reports
1. Navigate to "Reports" section
2. Select the type of report needed
3. Configure filters and parameters
4. Export reports in CSV format

## Development

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for better UX

### Adding New Features
1. Create new components in `src/components/`
2. Add corresponding types in `src/types/`
3. Update API service if needed
4. Add routing in `App.tsx`
5. Update navigation in `AdminDashboard.tsx`

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Verify backend services are running
   - Check API URL in environment variables
   - Ensure CORS is properly configured

2. **Authentication Issues**
   - Clear browser storage
   - Verify admin credentials
   - Check JWT token expiration

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript compilation
   - Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Attendance Management System.
