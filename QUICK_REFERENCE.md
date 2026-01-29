# Quick Reference Card

## 🚀 Start the Stack

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ Runs on: http://localhost:4000

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
✅ Runs on: http://localhost:3000

## 🔐 Default Test Account

Create via signup in UI:
- **Email**: test@example.com
- **Password**: password123
- **Role**: AUTHOR (default)

## 📚 Available Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Create, edit, delete everything |
| **AUTHOR** | Create, edit own books/authors |
| **VIEWER** | Read-only (can create reviews) |

## 🛠️ Configuration Files

**Backend** (create from example):
```bash
cp backend/.env.example backend/.env
```

**Required ENV vars**:
- `DB_NAME=books_db`
- `DB_USER=sprinto_user`
- `DB_PASSWORD=password`
- `JWT_SECRET=your-secret-key`
- `REFRESH_SECRET=your-refresh-secret`

## 🗄️ Database Setup

### PostgreSQL
```bash
# Start PostgreSQL
brew services start postgresql

# Create database
createdb books_db

# Create user
createuser sprinto_user
```

### MongoDB
```bash
# Start MongoDB
brew services start mongodb-community
```

## 🧪 Test API

### GraphQL Playground
Visit: http://localhost:4000 (in browser)

### Example Query
```graphql
query {
  books(page: 1, limit: 10) {
    books {
      id
      title
      author {
        name
      }
    }
    total
  }
}
```

### Example Mutation (Login)
```graphql
mutation {
  login(input: {
    email: "test@example.com"
    password: "password123"
  }) {
    user {
      id
      name
      role
    }
    accessToken
  }
}
```

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | http://localhost:4000/ | GraphQL queries/mutations |
| GET | http://localhost:4000/ | GraphQL Playground |

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | 30-second setup |
| `AUTH_SETUP.md` | Detailed auth config |
| `SETUP_AND_RUN.md` | Complete guide |
| `CORS_FIX.md` | CORS solution |
| `PROJECT_STATUS.md` | Full project status |

## 🧠 Architecture

```
Frontend (React/Next.js)
    ↓ (http://localhost:3000)
    ↓ GraphQL requests
Backend (Apollo Server)
    ↓ (http://localhost:4000)
    ↓ Auth + CORS
Database (PostgreSQL + MongoDB)
```

## 🔐 Authentication Flow

1. User visits http://localhost:3000
2. Redirected to login if not authenticated
3. Signup/Login sends credentials to backend
4. Backend returns JWT tokens
5. Tokens stored in secure cookies
6. Frontend includes token in requests
7. Backend validates token
8. Request processed with auth context

## 📝 Key Features

✅ **JWT Authentication**: 15min access, 7day refresh  
✅ **Role-Based Authorization**: ADMIN, AUTHOR, VIEWER  
✅ **CORS Enabled**: Frontend ↔ Backend communication  
✅ **Secure Cookies**: HttpOnly, Secure, SameSite  
✅ **Protected Routes**: Frontend route protection  
✅ **GraphQL API**: Queries, mutations, subscriptions  

## 🐛 Common Issues

### "CORS Error"
```bash
# Check backend is running
curl http://localhost:4000/

# Restart backend
cd backend && npm run dev
```

### "Cannot connect to database"
```bash
# Check PostgreSQL
brew services list

# Check MongoDB
mongo --version

# Restart if needed
brew services restart postgresql
brew services restart mongodb-community
```

### "Port already in use"
```bash
# Find process on port 4000
lsof -i :4000

# Kill process (replace PID)
kill -9 <PID>
```

## 💡 Pro Tips

1. **GraphQL Playground**: Use browser DevTools → Network tab to inspect requests
2. **Tokens**: Stored in cookies, visible in DevTools → Application → Cookies
3. **Environment**: Copy `.env.example` to `.env` and customize
4. **Hot Reload**: Both servers support hot module reloading
5. **Logs**: Check terminal output for detailed error messages

## 🎯 Next Steps

1. Start both servers (Terminal 1 & 2)
2. Visit http://localhost:3000
3. Sign up for account
4. Create sample data (books/authors)
5. Test different roles (modify DB)
6. Explore GraphQL API

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | Restart backend, check FRONTEND_URL in .env |
| DB connection | Start PostgreSQL/MongoDB, check credentials |
| Port in use | Kill process using `lsof -i :PORT` |
| Hot reload not working | Restart dev server |
| Login fails | Check credentials, verify DB connection |

---

**Status**: ✅ READY TO USE  
**Last Updated**: 2026-01-28  
**Auth**: ✅ Implemented  
**CORS**: ✅ Fixed
