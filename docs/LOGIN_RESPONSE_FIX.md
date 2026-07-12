# Login Response Structure Fix

## Issue
After successful login, the application was throwing an error:
```
Cannot destructure property 'user' of 'data.data' as it is undefined
```

## Root Cause
The backend API response structure was different from what we expected:

### Expected Structure (Nested):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

### Actual Structure (Flat):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "19|pzkuUl3chbQ59UZf27noZAeSiy4dgQcWBbU7hAMw98a814be",
  "user": {
    "id": 2,
    "email": "admin@gmail.com",
    "status": "active",
    "last_login_at": "2026-03-29T08:52:25.000000Z",
    "roles": ["admin"],
    "permissions": [...]
  }
}
```

## Solution

Updated the `useLogin` hook in `lib/hooks/public/useAuth.ts` to handle the flat response structure:

### Before:
```typescript
onSuccess: (data: any) => {
  const { user, token } = data.data; // ❌ Trying to access nested data
  // ...
}
```

### After:
```typescript
onSuccess: (data: any) => {
  console.log('Login data:', data); // Debug log
  
  // Backend returns: { success, message, token, user }
  // The user and token are at the root level, not nested in data.data
  const { user, token } = data; // ✅ Access from root level

  if (!user || !token) {
    console.error('Missing user or token in response:', data);
    throw new Error('Invalid response from server');
  }

  // Extract role from roles array if it exists
  const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'user';

  // Create user object with proper structure
  const userData = {
    id: user.id,
    name: user.name || user.email.split('@')[0], // Fallback to email username
    email: user.email,
    role: userRole as 'user' | 'admin' | 'chairman',
    status: user.status,
    phone: user.phone,
    address: user.address,
  };

  // Store token in localStorage
  authUtils.setToken(token);

  // Update auth context
  setAuthUser(token, userData);

  // Invalidate all queries to refresh data
  queryClient.invalidateQueries();

  // Redirect based on role
  if (userRole === 'admin' || userRole === 'chairman') {
    router.push('/admin');
  } else {
    router.push('/dashboard');
  }
}
```

## Key Changes

1. **Flat Response Handling**: Changed from `data.data` to `data` to access user and token
2. **Role Extraction**: Backend returns `roles` as an array, so we extract the first role
3. **Name Fallback**: If `name` is not provided, use email username as fallback
4. **Validation**: Added check to ensure user and token exist before proceeding
5. **Debug Logging**: Added console logs to help debug response structure
6. **User Data Mapping**: Properly map backend user structure to frontend User interface

## Backend Response Fields

The backend returns these fields:
- `success` (boolean) - Whether login was successful
- `message` (string) - Success/error message
- `token` (string) - Bearer token for authentication
- `user` (object) - User information
  - `id` (number) - User ID
  - `email` (string) - User email
  - `status` (string) - User status (active, inactive, etc.)
  - `last_login_at` (string) - Last login timestamp
  - `roles` (array) - Array of role names (e.g., ["admin"])
  - `permissions` (array) - Array of permission names

## Frontend User Interface

The frontend expects this User structure:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'chairman';
  status: string;
  phone?: string;
  address?: string;
}
```

## Testing

After this fix:
1. ✅ Login successfully completes
2. ✅ Token is stored in localStorage
3. ✅ User data is stored in AuthContext
4. ✅ User is redirected to `/admin` (for admin role)
5. ✅ No more "Cannot destructure" errors

## Debug Logs

You can see these logs in the browser console:
- `Fetching CSRF token from: http://127.0.0.1:8000/sanctum/csrf-cookie`
- `Login response: { success: true, message: "...", token: "...", user: {...} }`
- `Login data: { success: true, message: "...", token: "...", user: {...} }`

## Next Steps

If you want to remove the debug logs in production:
1. Remove or comment out the `console.log` statements
2. Or use a logging library that can be disabled in production
3. Or use environment variables to control logging:
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.log('Login response:', response.data);
   }
   ```
