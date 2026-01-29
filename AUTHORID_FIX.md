# AuthorId Fix - JWT Token Decoding

## Problem
When creating a book, the frontend was sending:
```
{ title: "...", description: "...", published_date: "..." }
```

But the backend requires:
```
{ title: "...", description: "...", published_date: "...", author_id: 1 }
```

**Error:** 
```
Field "author_id" of required type "Int!" was not provided.
```

## Root Cause
The frontend was trying to use `user.authorId`, but this field was not being stored from the authentication response. The backend returns the JWT token with `authorId` encoded inside it, but the frontend wasn't extracting it.

## Solution
Updated `lib/auth-context.tsx` to **decode the JWT token** and extract the `authorId` field:

### How JWT Tokens Work
A JWT token has 3 parts separated by dots:
```
header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBlbWFpbC5jb20iLCJyb2xlIjoiQVVUSE9SIiwiYXV0aG9ySWQiOjF9.
signature_here
```

The **payload** (middle part) is base64-encoded JSON containing:
```json
{
  "userId": 1,
  "email": "john@email.com",
  "role": "AUTHOR",
  "authorId": 1
}
```

### Implementation

**Updated `useEffect` (on app load):**
```typescript
// Load user from cookie on mount
useEffect(() => {
  const savedUser = Cookies.get('user');
  const accessToken = Cookies.get('accessToken');
  
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      
      // If authorId is missing but we have a token, decode it
      if (!user.authorId && accessToken) {
        try {
          // Extract and decode the payload
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          user.authorId = tokenPayload.authorId;
        } catch (tokenError) {
          console.error('Failed to decode token:', tokenError);
        }
      }
      
      setUser(user);
    } catch (error) {
      console.error('Failed to parse user cookie:', error);
      Cookies.remove('user');
    }
  }
  setIsLoading(false);
}, []);
```

**Updated `login` function:**
```typescript
const login = async (email: string, password: string) => {
  // ... existing code ...
  
  const data = await response.json();
  const { user: userData, accessToken, refreshToken } = data;
  
  // Decode token to get authorId
  const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
  const userWithAuthorId = {
    ...userData,
    authorId: tokenPayload.authorId,
  };

  // Store everything including authorId
  Cookies.set('user', JSON.stringify(userWithAuthorId), ...);
  setUser(userWithAuthorId);
};
```

**Updated `signup` function:**
```typescript
const signup = async (email: string, password: string, name: string) => {
  // ... existing code ...
  
  const data = await response.json();
  const { user: userData, accessToken, refreshToken } = data;
  
  // Decode token to get authorId
  const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
  const userWithAuthorId = {
    ...userData,
    authorId: tokenPayload.authorId,
  };

  // Store everything including authorId
  Cookies.set('user', JSON.stringify(userWithAuthorId), ...);
  setUser(userWithAuthorId);
};
```

---

## How to Decode JWT

```typescript
// JWT format: header.payload.signature
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImF1dGhvcklkIjoxfQ.signature";

// Split on dots
const parts = token.split('.');

// Get the payload (second part)
const encodedPayload = parts[1]; // eyJ1c2VySWQiOjEsImF1dGhvcklkIjoxfQ

// Decode base64
const decodedPayload = atob(encodedPayload); // {"userId":1,"authorId":1}

// Parse JSON
const payload = JSON.parse(decodedPayload); // { userId: 1, authorId: 1 }

// Access the field
console.log(payload.authorId); // 1
```

---

## What Changed

| Function | Change |
|----------|--------|
| `useEffect` (on mount) | Now decodes token to extract authorId |
| `login` | Now decodes token and stores authorId |
| `signup` | Now decodes token and stores authorId |

---

## Testing the Fix

### Before Fix:
```
1. Sign up
2. Go to create book
3. Error: Field "author_id" of required type "Int!" was not provided.
```

### After Fix:
```
1. Sign up
2. Go to create book
3. ✅ Book created successfully
```

---

## Why This Works

1. **Signup/Login** → Backend generates JWT with `authorId` inside
2. **Frontend receives JWT** → Decodes it to extract `authorId`
3. **Frontend stores** → `{ id, email, name, role, authorId }`
4. **Creating book** → Automatically uses `user.authorId`
5. **Backend validates** → Receives `author_id` and accepts it ✅

---

## Security Note

- ✅ JWT is still secure (signature prevents tampering)
- ✅ Only decoding the public payload (no secrets exposed)
- ✅ Same `authorId` that backend sent
- ✅ Happens client-side only

---

## Files Modified

- `frontend/lib/auth-context.tsx` - Decode JWT and extract authorId

---

## Testing Commands

After this fix, try:

```graphql
mutation {
    createBook(input: {
        title: "My Book"
        description: "Description"
        published_date: "2024-01-01"
        author_id: 1
    }) {
        id
        title
        author { name }
    }
}
```

Expected result: ✅ Book created with your author_id automatically included

---

**Issue Fixed!** 🎉

Now when you create a book, `author_id` will be automatically populated from your user's `authorId`.
