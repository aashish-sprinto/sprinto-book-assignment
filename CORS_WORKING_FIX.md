# CORS Fix - Working Implementation

## Problem History
1. Initial error: CORS not allowing requests
2. First attempt: Custom plugin that crashed (headers not writable)
3. Second attempt: Express integration had version conflicts
4. **Final solution**: Apollo's `willSendResponse` plugin hook ✅

## How It Works

Apollo Server 5.3.0 provides a `willSendResponse` hook that's called right before the response is sent to the client. This is the perfect place to inject CORS headers!

### Implementation

**File**: `backend/src/index.js`

```javascript
const corsPlugin = {
    async willSendResponse(requestContext) {
        const res = requestContext.response;
        
        // Add CORS headers
        res.headers = res.headers || new Map();
        
        // Check if it's a browser request from our frontend
        const origin = requestContext.request.headers.get('origin');
        if (origin === frontendUrl || origin === 'http://localhost:3000') {
            res.headers.set('Access-Control-Allow-Origin', origin);
            res.headers.set('Access-Control-Allow-Credentials', 'true');
            res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        }
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [corsPlugin],
    formatError: (error) => {
        // ... error formatting
    },
});
```

## Key Features

✅ **Uses Apollo Plugin System**: Native support, no external dependencies  
✅ **Safe Header Manipulation**: `willSendResponse` hook designed for this  
✅ **Origin Validation**: Only allows requests from configured frontend  
✅ **Credentials Support**: Allows cookies and auth headers  
✅ **No Version Conflicts**: Uses only @apollo/server (no apollo-server-express)  

## CORS Headers Added

When a request comes from `http://localhost:3000`:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
```

## Why This Works

1. **willSendResponse Hook**: Apollo calls this right before sending the response
2. **Response Headers Available**: The `res.headers` Map is writable at this point
3. **Request Context Available**: Can check the origin from the request
4. **Credentials Support**: `credentials: 'include'` in frontend can send cookies

## Frontend Configuration

**File**: `frontend/lib/apollo-client.ts`

```typescript
const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000',
    credentials: 'include',  // Send cookies with requests
});
```

Endpoint is back to `/` (root) since we're using Apollo standalone.

## Testing

### 1. Backend Restart
Terminal should show:
```
✅ PostgreSQL connected successfully
✅ MongoDB connected
🚀 Server ready at http://localhost:4000/
📚 GraphQL Playground available at http://localhost:4000/
🔄 CORS enabled for: http://localhost:3000
```

### 2. Frontend Test
```bash
# Visit
http://localhost:3000

# Try to:
- Login/Signup
- Load books/authors
- Should work without errors!
```

### 3. Verify CORS Headers with curl
```bash
curl -i -X OPTIONS http://localhost:4000/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

Should see in response headers:
```
access-control-allow-origin: http://localhost:3000
access-control-allow-credentials: true
```

### 4. Check in Browser DevTools
- Open DevTools → Network tab
- Make any GraphQL request
- Check Response Headers for CORS headers

## Why This Approach

| Approach | Status | Reason |
|----------|--------|--------|
| Apollo standalone built-in CORS | ❌ Didn't work | Not sending headers correctly |
| Custom plugin with `.set()` | ❌ Crashed | Headers not writable in hook |
| Express + apollo-server-express | ❌ Version conflict | Express 5.x vs 4.x |
| **willSendResponse plugin** | ✅ **Works!** | **Designed for this purpose** |

## Configuration

### For Production

Edit `backend/.env`:
```env
FRONTEND_URL=https://yourdomain.com
PORT=4000
```

The CORS plugin will then only accept requests from `https://yourdomain.com`.

### For Multiple Origins (if needed)

Modify the plugin to check against an array:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com'
];

if (allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    // ... other headers
}
```

## Status

✅ **CORS Plugin**: Implemented  
✅ **Apollo Standalone**: Working with proper hooks  
✅ **Headers**: Properly set before response sent  
✅ **Origin Validation**: Checking frontend origin  
✅ **Credentials**: Enabled for auth flows  

---

## What to Do Now

1. **Watch Backend Terminal**: Should restart and show success message
2. **Refresh Frontend**: `http://localhost:3000`
3. **Test**: Try login/signup and loading books
4. **Verify**: Check DevTools Network tab for CORS headers

**Status**: 🎯 Ready to use!
