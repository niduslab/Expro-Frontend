# Login Redirect Fix

## Issue
After successful login, the user was not being redirected to `/admin`. Instead, they remained on the login page with the URL showing:
```
http://localhost:3000/login?from=%2Fadmin
```

## Root Cause
The issue was caused by:
1. **Soft navigation**: Using `router.push()` from Next.js which does a client-side navigation
2. **Timing issue**: The redirect was happening before the auth state was fully updated
3. **No auth check on login page**: The login page wasn't checking if the user was already logged in

## Solution

### 1. Changed to Hard Redirect (`window.location.href`)

Updated `lib/hooks/public/useAuth.ts` to use `window.location.href` instead of `router.push()`:

```typescript
onSuccess: (data: any) => {
  // ... token and user data handling ...

  // Store token in localStorage
  authUtils.setToken(token);

  // Update auth context
  setAuthUser(token, userData);

  // Invalidate all queries to refresh data
  queryClient.invalidateQueries();

  // Redirect based on role
  const redirectPath = userRole === 'admin' || userRole === 'chairman' 
    ? '/admin' 
    : '/dashboard';
  
  console.log('Redirecting to:', redirectPath); // Debug log
  
  // Use window.location for a hard redirect to ensure it works
  setTimeout(() => {
    window.location.href = redirectPath;
  }, 500); // Small delay to ensure state is updated
}
```

### 2. Added Auth Check on Login Page

Updated `app/login/page.tsx` to redirect if user is already logged in:

```typescript
export default function LoginPage() {
  const router = useRouter();
  // ... other state ...

  // Check if user is already logged in
  useEffect(() => {
    const token = authUtils.getToken();
    if (token) {
      console.log('User already logged in, redirecting...');
      // User is already logged in, redirect to admin
      window.location.href = '/admin';
    }
  }, []);

  // ... rest of component ...
}
```

## Why Hard Redirect?

### `router.push()` (Client-side navigation)
- ❌ Doesn't reload the page
- ❌ May not trigger layout re-renders
- ❌ Auth state might not be fully propagated
- ❌ Can be interrupted by other navigation logic

### `window.location.href` (Hard redirect)
- ✅ Forces a full page reload
- ✅ Ensures all layouts and components re-mount
- ✅ Auth state is read fresh from localStorage
- ✅ Guarantees the redirect happens

## Timing Considerations

Added a 500ms delay before redirect to ensure:
1. Token is written to localStorage
2. Auth context is updated
3. Query cache is invalidated
4. All state updates are complete

```typescript
setTimeout(() => {
  window.location.href = redirectPath;
}, 500);
```

## Debug Logs Added

Added console logs to help troubleshoot:
```typescript
console.log('Storing token and user data:', { token, userData });
console.log('Redirecting to:', redirectPath);
console.log('User already logged in, redirecting...');
```

## Flow After Fix

### Login Flow:
```
1. User submits credentials
   ↓
2. CSRF token fetched
   ↓
3. Login API called
   ↓
4. Response received with token and user
   ↓
5. Token stored in localStorage
   ↓
6. Auth context updated
   ↓
7. Query cache invalidated
   ↓
8. Wait 500ms
   ↓
9. Hard redirect to /admin
   ↓
10. Page reloads
   ↓
11. Admin layout loads
   ↓
12. User sees admin dashboard
```

### Already Logged In Flow:
```
1. User navigates to /login
   ↓
2. useEffect checks for token
   ↓
3. Token found in localStorage
   ↓
4. Hard redirect to /admin
   ↓
5. User sees admin dashboard
```

## Testing

After this fix:
1. ✅ Login successfully redirects to `/admin`
2. ✅ Page fully reloads with admin layout
3. ✅ Token persists across page reload
4. ✅ Already logged-in users can't access login page
5. ✅ No more `?from=%2Fadmin` in URL

## Alternative Solutions (Not Used)

### Option 1: Middleware
Create `middleware.ts` to protect routes:
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```
**Why not used**: Adds complexity, hard redirect is simpler

### Option 2: Layout-level Auth Check
Add auth check in admin layout:
```typescript
export default function AdminLayout({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    redirect('/login');
  }
  return <>{children}</>;
}
```
**Why not used**: Can cause flash of content, hard redirect is cleaner

### Option 3: Server-side Redirect
Use Next.js server components with redirect:
```typescript
export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  return <AdminDashboard />;
}
```
**Why not used**: Requires server-side session management

## Notes

- The 500ms delay can be adjusted if needed (100-1000ms range)
- Debug logs can be removed in production
- Hard redirect is intentional for reliability
- This approach works with both admin and regular user roles

## Future Improvements

1. Add loading spinner during redirect
2. Implement proper middleware for route protection
3. Add session expiry handling
4. Implement refresh token logic
5. Add "Remember me" functionality
