# Employee Attendance Frontend

A modern React.js frontend for the Employee Attendance Management System. Built with TypeScript, Tailwind CSS, and React Router.

## Features

- 🔐 **Authentication System** - Secure login with JWT tokens
- ⏰ **Clock In/Out** - Easy attendance tracking with notes
- 📊 **Attendance History** - View and filter past attendance records
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean and intuitive interface with Tailwind CSS
- 📈 **Admin Features** - Role-based access control (coming soon)
- 📤 **Data Export** - Export attendance data to CSV

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date formatting

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AttendanceCard.tsx      # Clock in/out functionality
│   │   ├── AttendanceHistory.tsx   # Attendance records table
│   │   ├── Dashboard.tsx           # Main dashboard layout
│   │   ├── LoginForm.tsx           # Authentication form
│   │   └── ProtectedRoute.tsx      # Route protection
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── services/
│   │   └── api.ts                  # API service layer
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── App.tsx                     # Main app component
│   ├── index.tsx                   # App entry point
│   └── index.css                   # Global styles
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## API Integration

The frontend communicates with the backend API through the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/validate-token` - Token validation

### Attendance
- `POST /attendance/clock-in` - Clock in
- `POST /attendance/clock-out` - Clock out
- `GET /attendance/status` - Get current status
- `GET /attendance/my-records` - Get user's attendance records
- `GET /attendance` - Get all records (admin)
- `GET /attendance/employee/:id` - Get employee records (admin)

## Usage

### For Employees

1. **Login** - Use your email and password to access the system
2. **Clock In** - Click the "Clock In" button when you start work
3. **Add Notes** - Optionally add notes about your work
4. **Clock Out** - Click "Clock Out" when you finish work
5. **View History** - Check your attendance records in the History tab

### For Administrators

- Access to all employee features
- View all employee attendance records
- Generate reports (coming soon)
- Manage system settings (coming soon)

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000
```

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add TypeScript types in `src/types/`
3. Update API service in `src/services/api.ts`
4. Add routes in `src/App.tsx`

### Styling

The project uses Tailwind CSS for styling. Custom styles can be added in `src/index.css` using the `@layer` directive.

### State Management

Authentication state is managed through React Context (`AuthContext`). For more complex state, consider using Redux or Zustand.

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
