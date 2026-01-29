# Sprinto Books - Authentication & Authorization System

## 📚 Overview

A complete, production-grade authentication and authorization system has been integrated into the Sprinto Books Library application. The system supports user registration, login, JWT token management, and role-based access control.

## 🚀 Quick Links

- **🏃 Getting Started**: See [QUICK_START.md](./QUICK_START.md)
- **📖 Full Documentation**: See [AUTH_SETUP.md](./AUTH_SETUP.md)
- **🔧 Technical Details**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## ⚡ 30-Second Setup

```bash
# 1. Configure environment
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secrets

# 2. Start services
npm run dev          # backend (terminal 1)
cd ../frontend
npm run dev          # frontend (terminal 2)

# 3. Use the app
# Visit http://localhost:3000
# Sign up for an account
# Start managing books and authors!
```

## ✨ Key Features

### Authentication
- ✅ User registration with email/password
- ✅ JWT-based login system
- ✅ Token refresh mechanism (15min access, 7day refresh)
- ✅ Secure password hashing (bcrypt)
- ✅ Secure token storage (HttpOnly cookies)

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Three user roles: ADMIN, AUTHOR, VIEWER
- ✅ Granular permissions per operation
- ✅ Protected GraphQL mutations
- ✅ Protected frontend routes

### Security
- ✅ No breaking changes to existing features
- ✅ Environment variable secret management
- ✅ CSRF protection (SameSite cookies)
- ✅ HTTPS-ready (Secure flag on cookies)
- ✅ Type-safe TypeScript implementation

## 🎯 User Flows

### New User Registration
```
Sign Up Page → Fill Form → Create Account → Auto Login → Dashboard
```

### Existing User Login
```
Login Page → Enter Credentials → Verify → Set Tokens → Dashboard
```

### Protected Operations
```
Perform Action → Check Token → Verify Role → Execute → Return Result
```

## 📋 Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Next.js)      │
├─────────────────────────────────────────┤
│  Auth Context → Protected Routes → UI   │
│  Stores tokens in cookies               │
├─────────────────────────────────────────┤
│         API Routes (Auth Gateway)       │
│  /api/auth/login, /api/auth/signup      │
├─────────────────────────────────────────┤
│     Backend (Apollo GraphQL Server)     │
├─────────────────────────────────────────┤
│  GraphQL Resolvers + Auth Middleware    │
│  JWT verification, role checks          │
├─────────────────────────────────────────┤
│    Database (PostgreSQL + MongoDB)      │
│  Users table, refresh token storage     │
└─────────────────────────────────────────┘
```

## 🔐 User Roles

| Role | Create Books | Update Books | Delete Books | Create Reviews | Delete Reviews |
|------|:------------:|:------------:|:------------:|:--------------:|:--------------:|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ |
| AUTHOR | ✅ | ✅ | ❌ | ✅ | ❌ |
| VIEWER | ❌ | ❌ | ❌ | ✅ | ❌ |

## 📁 What Was Added

### Backend
- `src/models/User.js` - User data model
- `src/utils/jwt.js` - Token utilities
- `src/middleware/auth.js` - Authentication middleware
- `.env.example` - Configuration template

### Frontend
- `lib/auth-context.tsx` - Auth state management
- `lib/protected-route.tsx` - Route protection component
- `app/auth/login/page.tsx` - Login UI
- `app/auth/signup/page.tsx` - Signup UI
- `app/api/auth/` - Auth API routes

### Updated Files
- Backend: `typeDefs.js`, `resolvers.js`, `index.js`
- Frontend: `apollo-client.ts`, `layout.tsx`, `NavBar.tsx`, books/authors pages

## ✅ What Wasn't Changed

- ✅ Book and Author models (fully backward compatible)
- ✅ All existing queries work unchanged
- ✅ Database schema (only added users table)
- ✅ Design and styling system
- ✅ Public pages and routes

## 🧪 Testing

### Test Login Flow
1. Open http://localhost:3000/auth/signup
2. Create an account
3. You're automatically logged in
4. Access /books and /authors
5. Create a book or author
6. Logout
7. Login again with same credentials
8. Verify your data persists

### Test Authorization
1. Login as AUTHOR
2. Try to delete an author (should fail)
3. Create a book (should succeed)
4. Change role to ADMIN in database
5. Delete an author (should succeed)

### Test Token Refresh
1. Login
2. Wait 15+ minutes
3. Make a request (access token should auto-refresh)

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'AUTHOR', 'VIEWER') DEFAULT 'VIEWER',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🔑 Environment Variables

Required in `backend/.env`:
```env
DB_NAME=books_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters
PORT=4000
```

## 📡 GraphQL Endpoints

All protected endpoints require Bearer token:
```
Authorization: Bearer <accessToken>
```

### Public Endpoints (no auth needed)
- Query: `healthCheck`, `books`, `book`, `authors`, `author`, `reviews`

### Protected Endpoints (auth required)
- Mutation: `signup`, `login`, `refreshToken`
- Mutation: `createAuthor`, `updateAuthor`, `deleteAuthor`
- Mutation: `createBook`, `updateBook`, `deleteBook`
- Mutation: `createReview`, `deleteReview`

## 🚀 Deployment

### Production Checklist
- [ ] Update JWT secrets in `.env` (generate strong random strings)
- [ ] Enable HTTPS (required for Secure cookies)
- [ ] Set `NODE_ENV=production`
- [ ] Update `NEXT_PUBLIC_GRAPHQL_URL` to production backend
- [ ] Run database migrations
- [ ] Set up proper secret management
- [ ] Configure CORS for your domain
- [ ] Monitor logs for security issues

## 🐛 Troubleshooting

### "Cannot login"
- Check backend is running: `curl http://localhost:4000`
- Check database credentials in `.env`
- Check browser console for error messages

### "Protected route redirects to login"
- Verify token is stored in cookies (DevTools → Application → Cookies)
- Check token expiration
- Verify GraphQL query includes Authorization header

### "Role-based permission denied"
- Check user's role in database
- Verify role is included in JWT token
- Check resolver's `requireRole()` function

### "TypeScript errors after changes"
- Run `npm run lint` to check syntax
- Clear `.next/` folder and rebuild
- Reinstall dependencies if issues persist

## 📚 Learning Resources

1. **JWT Tokens**: https://jwt.io
2. **GraphQL Security**: https://graphql.org/learn/security/
3. **Bcrypt**: https://github.com/kelektiv/node.bcrypt.js
4. **Next.js Auth**: https://nextjs.org/docs/authentication

## 🤝 Support

For questions or issues:
1. Review the documentation in `AUTH_SETUP.md`
2. Check implementation details in `IMPLEMENTATION_SUMMARY.md`
3. Review error messages in browser console and backend logs
4. Verify all environment variables are set

## 📝 Version Info

- **Implementation Date**: 2026-01-28
- **Backend**: Node.js with Apollo Server
- **Frontend**: Next.js 16 with React 19
- **Database**: PostgreSQL + MongoDB
- **Security**: JWT, bcrypt, secure cookies

---

**Ready to get started?** → See [QUICK_START.md](./QUICK_START.md)

**Need details?** → See [AUTH_SETUP.md](./AUTH_SETUP.md)

**Want tech specs?** → See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
