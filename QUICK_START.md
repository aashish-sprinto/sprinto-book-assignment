# Quick Start Guide - Authentication System

## Prerequisites

- Node.js (v18+)
- PostgreSQL running locally
- MongoDB running locally (for reviews)

## Setup Steps

### 1. Backend Configuration

```bash
cd backend

# Copy example env file
cp .env.example .env

# Update .env with your database credentials
# DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
# JWT_SECRET and REFRESH_SECRET (generate random strings)
```

### 2. Start Backend Server

```bash
cd backend
npm install  # if not already done
npm run dev
```

Should see: `🚀 Server ready at http://localhost:4000`

### 3. Start Frontend Development Server

```bash
cd frontend
npm install  # if not already done
npm run dev
```

Should see: `▲ Next.js` running on `http://localhost:3000`

## First Time Usage

1. **Open** http://localhost:3000
2. **Click** "Sign In" in the navigation (top right)
3. **Click** "Sign up" link to create new account
4. **Enter**: email, password (min 6 chars), name
5. **Submit** - You'll be auto-logged in
6. **Navigate** to Books or Authors pages
7. **Create** some books and authors

## User Roles

After signup, your role is automatically set to **AUTHOR**

To change roles manually (requires database access):

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Available roles:
- `ADMIN` - Full control
- `AUTHOR` - Can create/edit books and authors
- `VIEWER` - Read-only (can view but not create)

## Testing the System

### Test 1: Authentication Flow
1. Sign up with new email
2. Create a book
3. Logout (top right button)
4. Verify you're redirected to login
5. Login with same credentials
6. Verify you can see your book

### Test 2: Authorization
1. Try to delete an author (ADMIN only)
2. Change role to VIEWER in database
3. Logout and login
4. Try to create a book (should fail with permission error)

### Test 3: Token Refresh
1. Login
2. Wait 15+ minutes
3. Try to create a book (should automatically refresh token)

## Troubleshooting

### "Cannot find module" errors
```bash
npm install  # Install all dependencies
```

### GraphQL connection errors
```
- Check backend is running on port 4000
- Check NEXT_PUBLIC_GRAPHQL_URL env var (if custom port)
- Check network tab in browser DevTools
```

### Database connection errors
```
- Verify PostgreSQL is running
- Check DB credentials in .env
- Verify database exists: createdb books_db
```

### Login not working
```
- Check browser console for errors
- Verify backend is responding: curl http://localhost:4000
- Check network tab - POST /api/auth/login should return 200
```

## Environment Variables

### Backend (.env)
```env
DB_NAME=books_db              # PostgreSQL database name
DB_USER=postgres              # PostgreSQL user
DB_PASSWORD=password          # PostgreSQL password
DB_HOST=localhost             # PostgreSQL host
DB_PORT=5432                  # PostgreSQL port
JWT_SECRET=your-secret-key    # Used for access tokens
REFRESH_SECRET=refresh-secret # Used for refresh tokens
PORT=4000                     # Server port
```

### Frontend (automatic from backend)
Uses `NEXT_PUBLIC_GRAPHQL_URL` which defaults to `http://localhost:4000`

To use different backend:
```bash
# In frontend/.env.local
NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com
```

## File Structure

### Backend
```
backend/
├── src/
│   ├── models/
│   │   ├── User.js          [NEW] - User model
│   │   ├── Author.js
│   │   ├── Book.js
│   │   └── index.js         [UPDATED] - Exports User
│   ├── middleware/
│   │   └── auth.js          [NEW] - Auth logic
│   ├── utils/
│   │   └── jwt.js           [NEW] - JWT utilities
│   ├── graphql/
│   │   ├── typeDefs.js      [UPDATED] - Auth types
│   │   └── resolvers.js     [UPDATED] - Auth resolvers
│   └── index.js             [UPDATED] - Auth middleware
└── .env.example             [NEW] - Env template
```

### Frontend
```
frontend/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx   [NEW] - Login page
│   │   └── signup/page.tsx  [NEW] - Signup page
│   ├── api/auth/
│   │   ├── login/route.ts   [NEW] - Login API
│   │   └── signup/route.ts  [NEW] - Signup API
│   ├── books/new/page.tsx   [UPDATED] - Protected
│   ├── authors/new/page.tsx [UPDATED] - Protected
│   ├── layout.tsx           [UPDATED] - Added AuthProvider
│   └── ...
├── lib/
│   ├── auth-context.tsx     [NEW] - Auth state
│   ├── protected-route.tsx  [NEW] - Route protection
│   └── apollo-client.ts     [UPDATED] - Auth token injection
└── components/
    └── NavBar.tsx           [UPDATED] - Auth UI
```

## Common Commands

```bash
# Backend
cd backend
npm run dev              # Start dev server
npm test                # Run tests
npm start               # Production start

# Frontend
cd frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Lint code
```

## Next Steps

1. ✅ System is working - you can start using it!
2. 📖 Read `AUTH_SETUP.md` for detailed documentation
3. 🔍 Read `IMPLEMENTATION_SUMMARY.md` for technical details
4. 🚀 Deploy to production following your hosting provider's guide

## Support

For issues or questions:
1. Check the error messages in browser console and backend logs
2. Verify environment variables are set correctly
3. Ensure all services (PostgreSQL, MongoDB) are running
4. Check file permissions if database operations fail

Happy coding! 🚀📚
