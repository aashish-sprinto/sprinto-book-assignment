# CORS Troubleshooting Guide

## Quick Fix Flowchart

```
Still getting CORS error?
    ↓
1. Is backend running?
   → No: Start with `npm run dev` in backend folder
   → Yes: Continue
    ↓
2. Did you refresh the browser?
   → No: Refresh with Cmd+Shift+R (Mac)
   → Yes: Continue
    ↓
3. Check if backend restarted
   → Check terminal for "Server ready" message
   → If "crashed": Note the error
    ↓
4. Test with curl
   → curl http://localhost:4000/
   → Shows JSON? Good. No response? Check logs
    ↓
5. Check browser console
   → What's the exact CORS error?
   → Copy and match against solutions below
```

## Common Issues & Solutions

### Issue 1: "No 'Access-Control-Allow-Origin' header"

**Cause**: Backend not sending CORS headers

**Solution**:
```bash
# 1. Verify backend is running
curl http://localhost:4000/

# 2. Check it returns response headers
curl -i http://localhost:4000/

# 3. Make sure backend.src/index.js has corsPlugin
grep -n "corsPlugin" backend/src/index.js

# 4. Restart backend
# Kill and restart: npm run dev
```

**Expected curl output**:
```
HTTP/1.1 200 OK
access-control-allow-origin: http://localhost:3000
access-control-allow-credentials: true
...
```

### Issue 2: "Origin not allowed"

**Cause**: Frontend origin doesn't match backend config

**Solution**:
```bash
# 1. Check frontend URL
# Should be: http://localhost:3000

# 2. Check backend .env
cat backend/.env | grep FRONTEND_URL
# Should show: FRONTEND_URL=http://localhost:3000

# 3. If using different port, update .env
echo "FRONTEND_URL=http://localhost:3000" >> backend/.env

# 4. Restart backend
```

### Issue 3: "Preflight request failed (OPTIONS)"

**Cause**: Browser sent OPTIONS request, backend didn't respond

**Solution**:
```bash
# Test OPTIONS request manually
curl -i -X OPTIONS http://localhost:4000/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"

# Should show CORS headers in response
```

If it fails:
```bash
# Restart backend and try again
# The willSendResponse hook should handle OPTIONS
```

### Issue 4: "Backend not restarting after changes"

**Cause**: nodemon not watching for changes

**Solution**:
```bash
# 1. Stop backend (Ctrl+C)
# 2. Clear nodemon cache
rm -rf backend/node_modules/.nodemon*

# 3. Restart
npm run dev
```

### Issue 5: "Can't connect to http://localhost:4000"

**Cause**: Port 4000 already in use

**Solution**:
```bash
# 1. Find process using port 4000
lsof -i :4000

# 2. Kill the process
kill -9 <PID>

# 3. Start backend again
npm run dev
```

### Issue 6: "GraphQL returns 500 error"

**Cause**: Backend error, not CORS

**Solution**:
```bash
# 1. Check backend terminal for error details
# 2. Check GraphQL Playground at http://localhost:4000
# 3. Look at requestContext in error messages
```

## Verification Steps

### Step 1: Backend Health Check
```bash
curl -i http://localhost:4000/
```

**Expected**:
- Status: 200
- CORS headers present
- Returns JSON

### Step 2: GraphQL Endpoint
```bash
curl -i -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

**Expected**:
- Status: 200
- Returns GraphQL response

### Step 3: CORS Headers
```bash
curl -i -X OPTIONS http://localhost:4000/ \
  -H "Origin: http://localhost:3000"
```

**Expected headers**:
```
access-control-allow-origin: http://localhost:3000
access-control-allow-credentials: true
access-control-allow-methods: GET, POST, OPTIONS, PUT, DELETE
access-control-allow-headers: Content-Type, Authorization, Accept
```

### Step 4: Browser Test
1. Open `http://localhost:3000`
2. Open DevTools (F12)
3. Network tab
4. Try to login
5. Look for GraphQL request
6. Check Response Headers
7. Should see CORS headers

## Debug Mode

### Enable Verbose Logging

**Backend** - Add to index.js:
```javascript
const corsPlugin = {
    async willSendResponse(requestContext) {
        const origin = requestContext.request.headers.get('origin');
        console.log('📍 Origin:', origin);
        console.log('📍 Frontend URL:', frontendUrl);
        console.log('📍 Match:', origin === frontendUrl);
        
        // ... rest of plugin
    },
};
```

**Frontend** - Add to apollo-client.ts:
```javascript
import { ApolloLink } from '@apollo/client';

const logLink = new ApolloLink((operation, forward) => {
    console.log('📤 Sending:', operation.operationName);
    return forward(operation).map(response => {
        console.log('📥 Received:', response.data);
        return response;
    });
});

// Use in client: link: logLink.concat(authLink.concat(httpLink))
```

## Common Error Messages

### "No 'Access-Control-Allow-Origin' header is present"
→ Backend not sending CORS headers  
→ Solution: Check if corsPlugin is applied

### "Credentials mode is 'include', but Access-Control-Allow-Credentials is missing"
→ Need `Access-Control-Allow-Credentials: true`  
→ Solution: Check corsPlugin sets this header

### "Method POST not allowed by Access-Control-Allow-Methods"
→ Backend not allowing POST  
→ Solution: Check `allowedHeaders` includes POST

### "Header Content-Type is not allowed"
→ `Content-Type` not in `allowedHeaders`  
→ Solution: Check corsPlugin includes Content-Type

## Network Tab Analysis

### What to look for:

1. **Request Headers**
   - `Origin: http://localhost:3000` ← Sent by browser
   - `Content-Type: application/json` ← GraphQL request
   - `Authorization: Bearer <token>` ← Auth token

2. **Response Headers**
   - `access-control-allow-origin: http://localhost:3000` ✅
   - `access-control-allow-credentials: true` ✅
   - `content-type: application/json` ✅

3. **Status Code**
   - 200 = OK ✅
   - 300-399 = Redirect ⚠️
   - 400-499 = Client error ❌
   - 500+ = Server error ❌

## Reset Everything

If completely stuck:

```bash
# 1. Stop both servers (Ctrl+C)

# 2. Clear caches
rm -rf backend/node_modules/.cache
rm -rf frontend/.next
rm -rf frontend/node_modules/.cache

# 3. Clear browser cache
# DevTools → Application → Clear all

# 4. Start fresh
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Get Help

When reporting issue, provide:

1. **Error message** (exact text)
2. **Browser** (Chrome, Safari, etc.)
3. **OS** (Mac, Windows, Linux)
4. **Terminal output** (backend logs)
5. **Network tab screenshot** (DevTools)

---

## Status Indicators

| Indicator | Good | Bad |
|-----------|------|-----|
| Backend starts | "Server ready" | Crash error |
| CORS headers | Show in curl | Missing |
| Browser request | 200 + headers | CORS error |
| Console | No red errors | Red CORS error |

---

**Need more help?** Check `CORS_WORKING_FIX.md` for technical details.
