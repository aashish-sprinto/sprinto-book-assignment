# Authentication & Authorization Setup Guide

## Overview

The Sprinto Books Library now has a complete authentication and authorization system with role-based access control (RBAC). Users can sign up, log in, and perform actions based on their assigned role.

## Features

- ✅ User registration and login with JWT tokens
- ✅ Role-based access control (ADMIN, AUTHOR, VIEWER)
- ✅ Token refresh mechanism for long-lived sessions
- ✅ Password hashing with bcrypt
- ✅ Protected routes on the frontend
- ✅ Authorization checks on GraphQL mutations

## Backend Setup

### 1. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DB_NAME=books_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server
PORT=4000
```

### 2. Database Migration

The User model will be automatically created when the server starts. The database table will have:

- `id` - Auto-incremented primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `role` - One of: ADMIN, AUTHOR, VIEWER (default: VIEWER)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### 3. User Roles

#### ADMIN
- Full access to all operations
- Can create, update, and delete books and authors
- Can delete reviews

#### AUTHOR
- Can create and update books and authors
- Can create reviews
- Cannot delete other user's content

#### VIEWER
- Read-only access to books and authors
- Can create reviews
- Cannot create, update, or delete books/authors

### 4. GraphQL Authentication Endpoints

#### Signup

```graphql
mutation {
  signup(input: {
    email: "user@example.com",
    password: "securepassword",
    name: "John Doe"
  }) {
    user {
      id
      email
      name
      role
    }
    accessToken
    refreshToken
  }
}
```

#### Login

```graphql
mutation {
  login(input: {
    email: "user@example.com",
    password: "securepassword"
  }) {
    user {
      id
      email
      name
      role
    }
    accessToken
    refreshToken
  }
}
```

#### Refresh Token

```graphql
mutation {
  refreshToken(refreshToken: "your-refresh-token") {
    user {
      id
      email
      name
      role
    }
    accessToken
    refreshToken
  }
}
```

#### Protected Mutation Example

All mutations now require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

### 5. Backend Files

New/Modified files:
- `src/models/User.js` - User model with bcrypt password hashing
- `src/utils/jwt.js` - JWT token generation and verification utilities
- `src/middleware/auth.js` - Authentication middleware
- `src/graphql/typeDefs.js` - Updated with auth types and mutations
- `src/graphql/resolvers.js` - Updated with auth resolvers and authorization checks
- `src/index.js` - Updated to extract auth context from requests
- `.env.example` - Environment variables template

## Frontend Setup

### 1. Auth Context

The `lib/auth-context.tsx` provides auth state management and functions:

```typescript
const { user, isLoading, login, signup, logout, getAccessToken } = useAuth();
```

### 2. Login/Signup Pages

- `/auth/login` - Login form
- `/auth/signup` - Registration form

Users are redirected to login if they try to access protected pages.

### 3. Protected Routes

Wrap components with `ProtectedRoute` to require authentication:

```tsx
import { ProtectedRoute } from '@/lib/protected-route';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Content />
    </ProtectedRoute>
  );
}
```

### 4. Frontend Files

New/Modified files:
- `lib/auth-context.tsx` - Auth context provider and hook
- `app/api/auth/login/route.ts` - API endpoint for login
- `app/api/auth/signup/route.ts` - API endpoint for signup
- `lib/protected-route.tsx` - Protected route component wrapper
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `components/NavBar.tsx` - Updated with auth UI
- `lib/apollo-client.ts` - Updated to include auth tokens
- `app/layout.tsx` - Updated with AuthProvider wrapper

## Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
2. **JWT Tokens**: 
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
3. **Secure Cookies**: Tokens stored with `Secure` and `SameSite` flags
4. **Token Verification**: All protected endpoints verify tokens before allowing access

## Running the Application

### Backend

```bash
cd backend
npm install  # if not already done
npm run dev
```

The server will start on `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install  # if not already done
npm run dev
```

The app will start on `http://localhost:3000`

## Flow

1. User visits the app and is redirected to `/auth/login` if not authenticated
2. User can sign up for a new account at `/auth/signup`
3. Upon signup/login, tokens are stored in cookies
4. Tokens are automatically included in GraphQL requests via Apollo Client
5. User can access books and authors pages
6. User can perform actions based on their role
7. User can logout, which clears tokens and redirects to home

## Testing

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Try to access `/books` or `/authors` - you'll be redirected to login
4. Sign up a new account
5. Create some books and authors
6. Logout and login to test the flow
7. Create another account with different role (requires manual DB change or admin panel)

## Future Enhancements

- Token refresh on expiry
- Email verification
- Social login (Google, GitHub)
- Multi-factor authentication
- Admin panel for user management
- Session management
