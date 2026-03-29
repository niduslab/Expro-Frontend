# Login CSRF Cookie URL Fix

## Issue
The login was failing with a 404 error when trying to fetch the CSRF cookie:
```
Request URL: http://localhost:3000/undefined/sanctum/csrf-cookie
Status: 404 Not Found
```

## Root Cause
1. The environment variable `NEXT_PUBLIC_API_BASE_URL` was set to `http://localhost:8000/api/v1` but the backend was running on `http://127.0.0.1:8000/`
2. The `getCsrfCookie` function was using `.replace('/api/v1', '')` which doesn't handle trailing slashes properly
3. When the environment variable was undefined, it resulted in `undefined/sanctum/csrf-cookie`

## Solution

### 1. Updated Environment Variable (`.env.local`)
Changed from:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

To:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 2. Fixed CSRF Cookie URL Construction

Updated in `lib/hooks/public/useAuth.ts`:
```typescript
async function getCsrfCookie(): Promise<void> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
    // Remove /api/v1 from the end to get the base URL
    const baseURL = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
    const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;
    
    console.log('Fetching CSRF token from:', csrfUrl); // Debug log
    
    await axios.get(csrfUrl, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to fetch CSRF cookie:', error);
    throw error;
  }
}
```

Updated in `lib/api/axios.ts`:
```typescript
const getCsrfToken = async (): Promise<void> => {
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Properly construct the base URL by removing /api/v1
  const baseURL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;

  csrfTokenPromise = axios
    .get(csrfUrl, {
      withCredentials: true,
    })
    .then(() => {
      csrfTokenPromise = null;
    })
    .catch((error) => {
      csrfTokenPromise = null;
      console.error('Failed to fetch CSRF token from:', csrfUrl, error);
      throw error;
    });

  return csrfTokenPromise;
};
```

### 3. Updated Default Fallback URLs
Changed all default fallback URLs from `http://localhost:8000/api/v1` to `http://127.0.0.1:8000/api/v1` in:
- `lib/api/axios.ts`
- `lib/api/BaseApi.ts`
- `lib/hooks/public/useAuth.ts`

## Key Improvements

1. **Regex-based URL replacement**: Using `/\/api\/v1\/?$/` instead of simple string replacement handles trailing slashes properly
2. **Fallback values**: Added proper fallback values to prevent undefined URLs
3. **Debug logging**: Added console logs to help debug CSRF token fetching issues
4. **Error handling**: Wrapped CSRF cookie fetching in try-catch blocks
5. **Consistent URLs**: All files now use `127.0.0.1` instead of `localhost` for consistency

## Expected Behavior

Now when logging in:
1. CSRF cookie is fetched from: `http://127.0.0.1:8000/sanctum/csrf-cookie`
2. Login request is sent to: `http://127.0.0.1:8000/api/v1/public/login`
3. User is redirected to `/admin` (for admin/chairman) or `/dashboard` (for regular users)
4. Toast notifications show success/error messages

## Testing

To test the fix:
1. Ensure backend is running on `http://127.0.0.1:8000`
2. Restart the Next.js development server to pick up the new environment variable
3. Navigate to `/login`
4. Enter valid credentials
5. Check browser console for CSRF token fetch log
6. Verify successful login and redirect

## Notes

- If you need to use `localhost` instead of `127.0.0.1`, update the `.env.local` file
- Make sure to restart the dev server after changing environment variables
- The CSRF cookie is required for Laravel Sanctum authentication
- All state-changing requests (POST, PUT, PATCH, DELETE) automatically fetch the CSRF token
