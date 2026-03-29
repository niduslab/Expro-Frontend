# Authentication Hooks Usage Guide

This guide explains how to use the new authentication hooks that integrate with the backend database API.

## Overview

The authentication system now uses React Query hooks for better state management, error handling, and automatic cache invalidation. All authentication flows are integrated with the Laravel backend API.

## Available Hooks

### 1. `useLogin()`

Handles user login with email and password.

```tsx
import { useLogin } from '@/lib/hooks';

function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

**Features:**
- Automatically fetches CSRF token
- Stores auth token in localStorage
- Updates AuthContext with user data
- Redirects to `/admin` for admin users, `/dashboard` for regular users
- Invalidates all queries on successful login

### 2. `useLogout()`

Handles user logout.

```tsx
import { useLogout } from '@/lib/hooks';

function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <button onClick={() => logout()} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

**Features:**
- Calls backend logout endpoint
- Clears auth token from localStorage
- Clears AuthContext
- Clears all cached queries
- Redirects to `/login`

### 3. `useCurrentUser()`

Fetches the authenticated user's profile.

```tsx
import { useCurrentUser } from '@/lib/hooks';

function UserProfile() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

**Features:**
- Only fetches if auth token exists
- Automatically updates AuthContext
- Cached for 5 minutes
- Retries once on failure

### 4. `useAuthStatus()`

Returns current authentication status.

```tsx
import { useAuthStatus } from '@/lib/hooks';

function ProtectedComponent() {
  const { isAuthenticated, user, isLoading } = useAuthStatus();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

## Authentication Flow

### Login Flow

```
1. User submits email/password
   ↓
2. useLogin() hook is called
   ↓
3. Fetch CSRF token from Laravel Sanctum
   ↓
4. POST /public/login with credentials
   ↓
5. Backend validates and returns { user, token }
   ↓
6. Store token in localStorage
   ↓
7. Update AuthContext with user data
   ↓
8. Invalidate all queries
   ↓
9. Redirect based on user role
   - admin/chairman → /admin
   - user → /dashboard
```

### Logout Flow

```
1. User clicks logout
   ↓
2. useLogout() hook is called
   ↓
3. POST /logout to backend
   ↓
4. Clear token from localStorage
   ↓
5. Clear AuthContext
   ↓
6. Clear all cached queries
   ↓
7. Redirect to /login
```

### Protected Route Flow

```
1. Component mounts
   ↓
2. useCurrentUser() checks for token
   ↓
3. If token exists:
   - Fetch user profile from /myprofile
   - Update AuthContext
   - Return user data
   ↓
4. If no token:
   - Skip fetch
   - Return null
```

## Integration with Backend API

### API Endpoints Used

- `GET /sanctum/csrf-cookie` - Get CSRF token for Laravel Sanctum
- `POST /public/login` - Login with email/password
- `POST /logout` - Logout current user
- `GET /myprofile` - Get current user profile

### Request/Response Format

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin",
      "status": "active"
    },
    "token": "1|abc123..."
  }
}
```

## User Roles

The system supports three user roles:

- `user` - Regular user (redirects to `/dashboard`)
- `admin` - Administrator (redirects to `/admin`)
- `chairman` - Chairman (redirects to `/admin`)

## Error Handling

All hooks provide error handling through React Query:

```tsx
const { mutate: login, error } = useLogin();

// Error object structure
if (error) {
  console.log(error.message); // User-friendly message
  console.log(error.response?.data); // Backend error details
}
```

## Token Management

Tokens are stored in localStorage and automatically attached to all API requests via axios interceptors.

```typescript
// Token is automatically added to headers
Authorization: Bearer 1|abc123...
```

## Context Integration

The hooks integrate with `AuthContext` to provide global authentication state:

```tsx
import { useAuth } from '@/lib/context/AuthContext';

function Component() {
  const { user, isAuthenticated, login, logout, updateUser } = useAuth();
  
  // Use context methods
}
```

## Migration from Old Auth

If you're using the old `lib/auth.ts` functions, migrate to hooks:

**Before:**
```tsx
import { login } from '@/lib/auth';

const result = await login(email, password);
if (result.user.role === 'admin') {
  router.push('/admin');
}
```

**After:**
```tsx
import { useLogin } from '@/lib/hooks';

const { mutate: login } = useLogin();
login({ email, password }); // Automatically redirects
```

## Best Practices

1. Always use hooks in client components (`"use client"`)
2. Handle loading states for better UX
3. Display error messages to users
4. Use `useAuthStatus()` for protected routes
5. Let hooks handle redirects automatically
6. Don't manually manage tokens - let hooks do it

## Example: Complete Login Page

See `app/login/page.tsx` for a complete implementation example.

## Example: Logout Button

See `components/admin/LogoutButton.tsx` for a reusable logout button component.
