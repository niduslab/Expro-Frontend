# API Client Usage Guide

This guide explains how to use the centralized API client for all frontend API calls. The client automatically handles CSRF tokens, authentication, and common error scenarios.

## Features

- ✅ Automatic CSRF token management (Laravel Sanctum)
- ✅ Automatic authentication token attachment
- ✅ CSRF token mismatch auto-retry (419 errors)
- ✅ Unauthorized request handling (401 errors)
- ✅ Rate limiting detection (429 errors)
- ✅ TypeScript support with type-safe responses
- ✅ Centralized error handling

## Basic Usage

### Import the API Client

```typescript
// For authenticated endpoints
import { apiRequest } from '@/lib/api/axios';

// For public endpoints (no login redirect on 401)
import { publicApiRequest } from '@/lib/api/axios';
```

### Making API Calls

#### GET Request
```typescript
const response = await apiRequest.get('/myprofile');
console.log(response.data);
```

#### POST Request (Authenticated)
```typescript
const response = await apiRequest.post('/memberprofile', {
  full_name: 'John Doe',
  phone: '1234567890',
});
```

#### POST Request (Public)
```typescript
// Use publicApiRequest for public endpoints like contact forms
const response = await publicApiRequest.post('/contactmessage', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  subject: 'Inquiry',
  message: 'Hello!',
});
console.log(response.data);
```

#### PUT Request
```typescript
const response = await apiRequest.put('/memberprofile/1', {
  full_name: 'John Doe Updated',
  phone: '9876543210',
});
```

#### DELETE Request
```typescript
await apiRequest.delete('/nominee/1');
```

## CSRF Token Handling

The API client automatically handles CSRF tokens for all state-changing requests (POST, PUT, PATCH, DELETE):

1. Before each state-changing request, it fetches a CSRF cookie from `/sanctum/csrf-cookie`
2. The CSRF token is automatically included in subsequent requests via cookies
3. If a 419 CSRF mismatch error occurs, it automatically retries with a fresh token

**You don't need to manually handle CSRF tokens!**

## Error Handling

### Basic Error Handling

```typescript
try {
  const response = await apiRequest.post('/contactmessage', data);
  // Handle success
} catch (error: any) {
  if (error.response?.data?.message) {
    console.error(error.response.data.message);
  } else if (error.response?.data?.errors) {
    // Laravel validation errors
    const errorMessages = Object.values(error.response.data.errors).flat();
    console.error(errorMessages);
  } else {
    console.error('An unexpected error occurred');
  }
}
```

### Automatic Error Handling

The client automatically handles:

- **419 CSRF Token Mismatch**: Automatically fetches a new token and retries
- **401 Unauthorized**: Clears auth token and redirects to `/login`
- **429 Rate Limiting**: Logs a warning message

## Authentication

### Set Auth Token (After Login)

```typescript
import { authUtils } from '@/lib/api/axios';

authUtils.setToken('your-auth-token');
```

### Check Authentication Status

```typescript
if (authUtils.isAuthenticated()) {
  // User is logged in
}
```

### Remove Auth Token (Logout)

```typescript
authUtils.removeToken();
```

## TypeScript Support

### Type-Safe Responses

```typescript
interface UserProfile {
  id: number;
  full_name: string;
  email: string;
}

const response = await apiRequest.get<UserProfile>('/myprofile');
const profile: UserProfile = response.data.data;
```

### API Response Types

```typescript
import { ApiResponse, PaginatedResponse, ApiError } from '@/lib/api/axios';

// Standard response
const response: ApiResponse<UserProfile> = await apiRequest.get('/myprofile');

// Paginated response
const response: PaginatedResponse<User[]> = await apiRequest.get('/users');
```

## Configuration

### Environment Variables

Set the API base URL in your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

For production:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.expro.com/api/v1
```

## Example: Contact Form

```typescript
'use client';

import { useState } from 'react';
import { publicApiRequest } from '@/lib/api/axios';
import { toast } from 'sonner';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await publicApiRequest.post('/contactmessage', {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        subject: 'Inquiry',
        message: 'Hello!',
      });

      if (response.data.success) {
        toast.success('Message sent successfully!');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send message';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

## Best Practices

1. **Use `publicApiRequest` for public endpoints** (contact forms, registration, etc.)
2. **Use `apiRequest` for authenticated endpoints** (user profile, wallet, etc.)
3. **Handle errors gracefully** with try-catch blocks
4. **Show user-friendly error messages** using toast notifications
5. **Use TypeScript types** for type-safe API responses
6. **Don't manually manage CSRF tokens** - the client handles it automatically
7. **Use `authUtils`** for authentication token management

## Troubleshooting

### CSRF Token Issues

If you still encounter CSRF errors:

1. Ensure your backend is configured for Laravel Sanctum
2. Check that `withCredentials: true` is set (already configured)
3. Verify the CSRF cookie domain matches your frontend domain
4. Check that `/sanctum/csrf-cookie` endpoint is accessible

### CORS Issues

Ensure your Laravel backend has proper CORS configuration in `config/cors.php`:

```php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:3000'],
```

### Authentication Issues

If auth tokens aren't working:

1. Verify the token is stored: `authUtils.getToken()`
2. Check the Authorization header in browser DevTools
3. Ensure the backend accepts Bearer tokens
