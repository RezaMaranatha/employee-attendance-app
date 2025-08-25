#!/bin/bash

echo "🚀 Setting up Employee Attendance Microservices locally..."

# Install dependencies for all services
echo "📦 Installing dependencies..."

echo "  Installing auth-service dependencies..."
cd services/auth-service && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && cd ../..

echo "  Installing employee-service dependencies..."
cd services/employee-service && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && cd ../..

echo "  Installing attendance-service dependencies..."
cd services/attendance-service && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && cd ../..

echo "  Installing api-gateway dependencies..."
cd services/api-gateway && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && cd ../..

echo "✅ Dependencies installed for all services!"

# Create environment files
echo "⚙️ Creating environment files..."

# Auth Service .env
cat > services/auth-service/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3001
NODE_ENV=development
EOF

# Employee Service .env
cat > services/employee-service/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=postgres

# Application Configuration
PORT=3002
NODE_ENV=development
EOF

# Attendance Service .env
cat > services/attendance-service/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=postgres

# Application Configuration
PORT=3003
NODE_ENV=development
EOF

# API Gateway .env
cat > services/api-gateway/.env << EOF
# Application Configuration
PORT=3000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
EMPLOYEE_SERVICE_URL=http://localhost:3002
ATTENDANCE_SERVICE_URL=http://localhost:3003
EOF

echo "✅ Environment files created!"

echo "🎉 Setup complete! Now you can run the services:"
echo ""
echo "Terminal 1: cd services/auth-service && npm run start:dev"
echo "Terminal 2: cd services/employee-service && npm run start:dev" 
echo "Terminal 3: cd services/attendance-service && npm run start:dev"
echo "Terminal 4: cd services/api-gateway && npm run start:dev"
echo ""
echo "Or use: npm run dev:all (if you create the script)"
