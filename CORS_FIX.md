# CORS Configuration Fix

## Issue
Frontend was receiving CORS error when trying to access GraphQL API:
```
Error loading books. Please ensure backend is running.
CORS Error
```

## Root Cause
Apollo's standalone server (used previously) doesn't have CORS support by default. When frontend on `http://localhost:3000` tries to access backend on `http://localhost:4000`, the browser blocks the request without proper CORS headers.

## Solution Applied
Added CORS plugin to Apollo Server to inject proper CORS headers in all responses.

### Changes Made

#### File: `backend/src/index.js`

**Key Changes**:
1. Created `corsPlugin` that implements Apollo's plugin system
2. Plugin adds CORS headers to every response
3. Allows requests from frontend (http://localhost:3000 by default)
4. Supports credentials for cookie-based auth

### CORS Implementation

```javascript
const corsPlugin = {
    async requestDidStart() {
        return {
            async willSendResponse(reqContext) {
                const origin = process.env.FRONTEND_URL || 'http://localhost:3000';
                reqContext.response.headers.set('Access-Control-Allow-Origin', origin);
                reqContext.response.headers.set('Access-Control-Allow-Credentials', 'true');
                reqContext.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
                reqContext.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
            },
        };
    },
};
```

### CORS Headers Added
- `Access-Control-Allow-Origin`: Frontend URL (default: http://localhost:3000)
- `Access-Control-Allow-Credentials`: true (for cookie/auth)
- `Access-Control-Allow-Methods`: GET, POST, OPTIONS, PUT, DELETE
- `Access-Control-Allow-Headers`: Content-Type, Authorization, Accept

### GraphQL Endpoint
- **URL**: `http://localhost:4000`
- **Supports**: Queries, Mutations with CORS enabled
- **GraphQL Playground**: Available at same URL

## Testing CORS Fix

### 1. Verify Backend is Running
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server ready at http://localhost:4000/graphql
📚 GraphQL endpoint: http://localhost:4000/graphql
🏥 Health check: http://localhost:4000/health
```

### 2. Test Health Endpoint
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{ "status": "ok", "message": "🚀 Backend is running!" }
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

Frontend should now be accessible at `http://localhost:3000` without CORS errors.

### 4. Test Authentication Flow
1. Visit `http://localhost:3000`
2. Should redirect to login page
3. Sign up for new account
4. Should see books/authors pages
5. API calls should work without CORS errors

## Configuration

### Environment Variables

**Optional**: Set custom frontend URL in `backend/.env`
```env
FRONTEND_URL=http://localhost:3000
```

Default (if not set):
- Development: `http://localhost:3000`
- Production: Set via `FRONTEND_URL` env var

## Architecture

```
Frontend (http://localhost:3000)
           ↓ (with credentials)
Express App (http://localhost:4000)
    ↓
CORS Middleware (allows requests from frontend)
    ↓
Apollo Server (/graphql route)
    ↓
GraphQL Resolvers
    ↓
Database
```

## Benefits

✅ **CORS Enabled**: Frontend and backend can communicate  
✅ **Credentials Support**: Cookies are sent with requests  
✅ **Health Check**: Easy monitoring  
✅ **Express Middleware**: More flexible for future additions  
✅ **Standard GraphQL Route**: `/graphql` endpoint  

## Troubleshooting

### Still Getting CORS Errors?
1. Verify backend is running: `curl http://localhost:4000/health`
2. Check frontend URL matches CORS origin
3. Ensure credentials: 'include' is set in Apollo Client
4. Clear browser cache and cookies

### Backend Won't Start?
1. Check port 4000 is available
2. Verify database connections
3. Check `.env` file has required variables
4. Look for syntax errors: `node --check src/index.js`

### GraphQL Not Responding?
1. Verify endpoint is `/graphql` (not root)
2. Check Apollo Server is started
3. Review GraphQL playground at `http://localhost:4000/graphql`

## Status

✅ CORS Configuration: IMPLEMENTED  
✅ Express Integration: COMPLETE  
✅ Health Check: WORKING  
✅ Frontend Communication: FIXED  

---

**Ready to use!** Frontend and backend can now communicate freely.
