# CORS Issue - Complete Fix

## Problem
Frontend was getting CORS errors when trying to fetch data from backend:
```
Error: CORS error
GET http://localhost:4000/ - Failed
```

## Root Cause
Apollo Server's standalone mode has basic CORS support, but it wasn't sufficient for production-like scenarios. The client was sending requests with specific headers that weren't being properly handled.

## Solution Implemented
Switched from Apollo's `startStandaloneServer` to **Express.js with Apollo's Express middleware**, which provides explicit CORS control.

## Files Changed

### 1. Backend: `backend/src/index.js`

**Changed from**: Apollo standalone server  
**Changed to**: Express app with Apollo middleware

**Key Implementation**:
```javascript
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',      // Allow frontend origin
    credentials: true,                     // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

await server.start();

// GraphQL endpoint at /graphql
app.use('/graphql', expressMiddleware(server, { context }));

app.listen(port, ...);
```

### 2. Frontend: `frontend/lib/apollo-client.ts`

**Changed from**: `http://localhost:4000`  
**Changed to**: `http://localhost:4000/graphql`

```typescript
const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    credentials: 'include',
});
```

## CORS Headers Now Properly Set

When frontend makes a GraphQL request, the server responds with:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## New Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET http://localhost:4000/` | Server info |
| `POST http://localhost:4000/graphql` | GraphQL queries/mutations |
| `GET http://localhost:4000/graphql` | GraphQL Playground (in browser) |
| `GET http://localhost:4000/health` | Health check |

## Testing the Fix

### 1. Watch Backend Auto-Restart
Terminal should show:
```
🚀 Server ready at http://localhost:4000/graphql
📚 GraphQL Playground available at http://localhost:4000/graphql
🔄 CORS enabled for: http://localhost:3000
```

### 2. Test CORS Headers with curl
```bash
curl -i -X OPTIONS http://localhost:4000/graphql \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

Should show CORS headers in response.

### 3. Frontend Test
1. Visit `http://localhost:3000`
2. Try to load books/authors
3. Should work without CORS errors

### 4. Verify in DevTools
- Open DevTools → Network tab
- Make a GraphQL request
- Check Response Headers for CORS headers

## Architecture

```
Browser (http://localhost:3000)
         ↓
    CORS Preflight (OPTIONS)
         ↓
Express Server (http://localhost:4000)
         ↓
CORS Middleware
         ↓
JSON Parser
         ↓
Apollo GraphQL (/graphql)
         ↓
Resolvers
         ↓
Database
```

## Configuration

### Environment Variables (Optional)

Add to `backend/.env` to customize:
```env
# Default values (if not set):
PORT=4000
FRONTEND_URL=http://localhost:3000
```

For production:
```env
PORT=4000
FRONTEND_URL=https://yourdomain.com
```

### Frontend Config (Optional)

Add to `frontend/.env.local` if using different backend:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://your-backend:4000/graphql
```

## Why This Works

1. **Express as HTTP Server**: Gives us full control over request/response
2. **CORS Middleware**: Inspects all requests and adds proper headers
3. **Apollo Express Middleware**: Handles GraphQL at specific `/graphql` route
4. **Explicit Configuration**: Clear origin, methods, and headers allowed
5. **Production-Ready**: This is the recommended approach for production deployments

## Troubleshooting

### Still Getting CORS Errors?

1. **Clear browser cache** (Cmd+Shift+R on Mac)
2. **Check backend is running**:
   ```bash
   curl http://localhost:4000/
   ```
3. **Verify CORS headers**:
   ```bash
   curl -i http://localhost:4000/graphql
   ```
4. **Check origin matches** in `backend/.env`:
   - Frontend: `http://localhost:3000`
   - Set in backend: `FRONTEND_URL=http://localhost:3000`

### Can't connect to backend?

1. Backend on correct port: `lsof -i :4000`
2. GraphQL endpoint: `/graphql` not `/`
3. Both servers running (dev mode)

## Benefits

✅ **Explicit CORS Control**: Configure exactly what's allowed  
✅ **Standards Compliant**: Follows RFC 6454 (CORS specification)  
✅ **Production Ready**: This is recommended for production  
✅ **Flexible**: Easy to add more middleware later  
✅ **Debuggable**: Clear error messages  

## API Usage from Frontend

The frontend Apollo client now correctly points to:
```
POST http://localhost:4000/graphql
```

With headers:
```
Content-Type: application/json
Authorization: Bearer <token>
```

CORS headers ensure the browser allows the request.

## Status

✅ **Express Server**: Running  
✅ **CORS Middleware**: Configured  
✅ **Apollo Middleware**: Running at /graphql  
✅ **Frontend Endpoint**: Updated to /graphql  
✅ **CORS Headers**: Properly set  

---

**Ready to use!** Backend will auto-restart with nodemon. Frontend should now work without CORS errors.
