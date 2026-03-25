# Frontend-Backend Connection Setup

## ✅ Configuration Complete

The frontend has been configured to properly connect to the Laravel backend according to the CORS and security requirements.

## Changes Made

### 1. Updated `app/tanstack/api/BaseApi.ts`
- Added `withCredentials: true` for cookie-based authentication
- Added `Accept: application/json` header
- Now properly configured for Laravel Sanctum

### 2. Updated `lib/auth.ts`
- Replaced mock authentication with real API calls
- Added CSRF cookie request before login (required by Laravel Sanctum)
- Implemented proper error handling
- Added `getCurrentUser()` function for profile fetching
- Cookies are now handled automatically by Laravel (HTTP-only)

### 3. Updated `app/login/page.tsx`
- Removed manual cookie setting
- Laravel Sanctum now handles cookies automatically
- Cleaner authentication flow

### 4. Created Environment Files
- `.env.local` - Active configuration (not committed to git)
- `.env.local.example` - Template for other developers

## Setup Instructions

### For Development

1. **Ensure Laravel backend is running:**
   ```bash
   # In your Laravel project directory
   php artisan serve
   # Backend should be running at http://localhost:8000
   ```

2. **Update `.env.local` if needed:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

4. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```

5. **Test the connection:**
   - Navigate to http://localhost:3000/login
   - Try logging in with your Laravel backend credentials
   - Check browser console for any CORS errors

### For Production

1. **Update `.env.local` with production URLs:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
   ```

2. **Ensure Laravel backend has correct CORS settings:**
   - Update `CORS_ALLOWED_ORIGINS` in Laravel `.env`
   - Update `SANCTUM_STATEFUL_DOMAINS` in Laravel `.env`
   - Set `SESSION_SECURE_COOKIE=true` for HTTPS

## Authentication Flow

The frontend now follows the proper Laravel Sanctum authentication flow:

```
1. User submits login form
   ↓
2. Frontend calls GET /sanctum/csrf-cookie
   (Laravel sets CSRF cookie)
   ↓
3. Frontend calls POST /api/v1/public/login
   (Laravel validates and sets session cookie)
   ↓
4. Subsequent API calls automatically include cookies
   (withCredentials: true ensures this)
```

## API Client Usage

All API calls should use the configured `apiClient`:

```typescript
import { apiClient } from '@/app/tanstack/api/BaseApi';

// Example: Fetch user profile
const response = await apiClient.get('/myprofile');

// Example: Update user data
const response = await apiClient.put('/user/update', {
  name: 'John Doe'
});

// Example: Create donation
const response = await apiClient.post('/donations', {
  amount: 100,
  type: 'monthly'
});
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Check Laravel `.env` has correct `CORS_ALLOWED_ORIGINS`
2. Ensure `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain
3. Verify Laravel backend is running

### 401 Unauthorized
If API calls return 401:
1. Check if CSRF cookie was obtained before login
2. Verify `withCredentials: true` is set in apiClient
3. Check Laravel session configuration

### Cookies Not Being Sent
If cookies aren't being sent with requests:
1. Ensure `withCredentials: true` in BaseApi.ts
2. Check browser settings allow cookies
3. Verify same-origin or CORS is properly configured

### Login Fails
If login fails:
1. Check Laravel backend logs
2. Verify credentials are correct
3. Check network tab in browser DevTools
4. Ensure `/sanctum/csrf-cookie` was called first

## Security Notes

- Cookies are HTTP-only (JavaScript cannot access them)
- CSRF protection is automatic with Sanctum
- Always use HTTPS in production
- Never commit `.env.local` to version control
- Session cookies expire based on Laravel configuration

## Related Files

- `app/tanstack/api/BaseApi.ts` - Axios client configuration
- `lib/auth.ts` - Authentication functions
- `app/login/page.tsx` - Login page component
- `.env.local` - Environment variables (not committed)
- `.env.local.example` - Environment template

## Backend Requirements

Ensure your Laravel backend has:
- CORS configured (see `CORS_AND_SECURITY_SETUP.md`)
- Sanctum installed and configured
- Session driver set to `database` or `redis`
- Proper routes in `routes/api.php`

## Next Steps

1. Test login functionality
2. Implement logout functionality in UI
3. Add authentication guards to protected routes
4. Implement token refresh if needed
5. Add loading states and error handling
6. Test with production backend
