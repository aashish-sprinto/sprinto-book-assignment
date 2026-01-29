# Complete Setup & Run Guide

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** running on localhost:5432
- **MongoDB** running on localhost:27017
- **npm** or **yarn** package manager

## Database Setup

### PostgreSQL

1. **Ensure PostgreSQL is running**
   ```bash
   # macOS (using Homebrew)
   brew services start postgresql
   
   # Or check if running
   psql --version
   ```

2. **Create database**
   ```bash
   createdb books_db
   ```

3. **Create user (if needed)**
   ```bash
   createuser sprinto_user
   psql
   # ALTER USER sprinto_user WITH PASSWORD 'my_strong_password';
   # ALTER USER sprinto_user CREATEDB;
   ```

### MongoDB

1. **Ensure MongoDB is running**
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Or check if running
   mongo --version
   ```

## Backend Setup

### Step 1: Navigate to Backend
```bash
cd /Users/aashishkumar/Desktop/sprinto-books-assignment/backend
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

### Step 3: Edit Environment File
Edit `backend/.env` and set:
```env
# Database
DB_NAME=books_db
DB_USER=sprinto_user
DB_PASSWORD=my_strong_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters

# Server
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
🚀 Server ready at http://localhost:4000/
📚 GraphQL Playground available at http://localhost:4000/
🔄 CORS enabled for: http://localhost:3000
```

## Frontend Setup

### Step 1: Navigate to Frontend
```bash
cd /Users/aashishkumar/Desktop/sprinto-books-assignment/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.1.5
  - Local:        http://localhost:3000
  - Environments: .env.local
```

## Verify Everything Works

### Step 1: Check Backend Health
```bash
curl http://localhost:4000/
```

### Step 2: Access Frontend
Open browser and visit: `http://localhost:3000`

### Step 3: Test Authentication
1. Should redirect to login page
2. Click "Sign up"
3. Create account with:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
4. Should auto-login and redirect to books page

### Step 4: Test Operations
- **View Books**: Should load without CORS errors
- **Create Book**: Click "Add New Book"
- **Create Author**: Click "Add New Author"
- **Logout**: Click logout in top right

## Troubleshooting

### CORS Error: "Error loading books"

**Problem**: Frontend can't reach backend
**Solutions**:
```bash
# 1. Verify backend is running
curl http://localhost:4000/

# 2. Check FRONTEND_URL in backend/.env
# Should be: http://localhost:3000

# 3. Restart backend after changes
npm run dev

# 4. Clear browser cache (Cmd+Shift+R on Mac)
```

### Database Connection Error

**Problem**: "Cannot connect to PostgreSQL"
**Solutions**:
```bash
# 1. Verify PostgreSQL is running
brew services list

# 2. Check credentials in .env
# User, password, port must match

# 3. Verify database exists
psql -U sprinto_user -d books_db

# 4. Create database if missing
createdb books_db
```

### MongoDB Connection Error

**Problem**: "Cannot connect to MongoDB"
**Solutions**:
```bash
# 1. Verify MongoDB is running
brew services list

# 2. Check MongoDB is on default port
mongo --eval "db.version()"

# 3. Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use

**Problem**: "Port 4000/3000 already in use"
**Solutions**:
```bash
# Find process using port 4000
lsof -i :4000

# Kill process (replace PID)
kill -9 <PID>

# Or use different port
PORT=5000 npm run dev  # backend
```

## Directory Structure

```
sprinto-books-assignment/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── graphql/         # GraphQL schema & resolvers
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/           # JWT utilities
│   │   ├── config/          # Database config
│   │   └── index.js         # Server entry point
│   ├── .env.example         # Environment template
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── auth/            # Login/signup pages
│   │   ├── books/           # Books pages
│   │   ├── authors/         # Authors pages
│   │   └── api/auth/        # Auth API routes
│   ├── lib/
│   │   ├── auth-context.tsx # Auth state management
│   │   ├── apollo-client.ts # GraphQL client
│   │   └── protected-route.tsx # Route protection
│   └── package.json
│
└── Documentation/
    ├── AUTH_README.md               # Auth overview
    ├── QUICK_START.md               # Quick setup
    ├── AUTH_SETUP.md                # Detailed config
    ├── CORS_FIX.md                  # CORS solution
    ├── SETUP_AND_RUN.md             # This file
    └── PROJECT_STATUS.md            # Full project status
```

## Common Commands

### Backend
```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Run tests
npm test
```

### Frontend
```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/`
- **GraphQL Playground**: Same URL (browser)

### Available Operations

**Authentication**:
- `signup(input: SignupInput!)` - Register new user
- `login(input: LoginInput!)` - Login user
- `refreshToken(refreshToken: String!)` - Refresh access token

**Books** (Protected):
- `createBook(input: CreateBookInput!)` - ADMIN, AUTHOR
- `updateBook(id: ID!, input: UpdateBookInput!)` - ADMIN, AUTHOR
- `deleteBook(id: ID!)` - ADMIN only
- `books(page: Int, limit: Int, filter: BookFilterInput)` - Public

**Authors** (Protected):
- `createAuthor(input: CreateAuthorInput!)` - ADMIN, AUTHOR
- `updateAuthor(id: ID!, input: UpdateAuthorInput!)` - ADMIN, AUTHOR
- `deleteAuthor(id: ID!)` - ADMIN only
- `authors(page: Int, limit: Int, filter: AuthorFilterInput)` - Public

## Testing Accounts

### Default Test Users (Create these via signup)

**Admin Account** (requires manual role update in DB):
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

**Author Account** (default on signup):
- Email: author@example.com
- Password: password123

**Viewer Account** (requires manual role update in DB):
```sql
UPDATE users SET role = 'VIEWER' WHERE email = 'viewer@example.com';
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Test authentication flow
6. ✅ Create sample data
7. ✅ Verify CORS is working
8. 🚀 Start developing!

## Additional Resources

- **Backend Documentation**: See `AUTH_SETUP.md`
- **Frontend Setup**: See `QUICK_START.md`
- **API Reference**: See `API_RESPONSE_REPORT.md`
- **Project Status**: See `PROJECT_STATUS.md`

---

**Status**: ✅ Ready to Run  
**Last Updated**: 2026-01-28  
**CORS Fix**: ✅ Implemented
