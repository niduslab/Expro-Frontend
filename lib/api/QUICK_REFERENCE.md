# API Client Quick Reference

## Import

```typescript
// For authenticated endpoints
import { apiRequest, authUtils } from '@/lib/api/axios';

// For public endpoints (contact forms, registration, etc.)
import { publicApiRequest } from '@/lib/api/axios';

// For toast notifications
import { toast } from 'sonner';
```

## Basic Requests

```typescript
// Authenticated GET
const response = await apiRequest.get('/myprofile');

// Public POST (no login redirect on 401)
const response = await publicApiRequest.post('/contactmessage', { name: 'John' });

// Authenticated PUT
const response = await apiRequest.put('/memberprofile/1', { name: 'Jane' });

// Authenticated DELETE
await apiRequest.delete('/nominee/1');
```

## Error Handling with Toast

```typescript
try {
  const response = await publicApiRequest.post('/contactmessage', data);
  toast.success('Message sent successfully!');
} catch (error: any) {
  const errorMsg = error.response?.data?.message || 'An error occurred';
  toast.error(errorMsg);
}
```

## Authentication

```typescript
// After login
authUtils.setToken(token);

// Check if logged in
if (authUtils.isAuthenticated()) { }

// Logout
authUtils.removeToken();
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
}

const response = await apiRequest.get<User>('/user/1');
const user: User = response.data.data;
```

## What's Automatic?

✅ CSRF token fetching  
✅ CSRF token retry on 419 errors  
✅ Auth token attachment  
✅ Redirect to login on 401  
✅ Base URL configuration  
✅ Credentials (cookies)

## Environment Setup

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Common Mistakes

❌ Don't use raw axios  
❌ Don't manually fetch CSRF tokens  
❌ Don't hardcode API URLs  
❌ Don't manually add withCredentials  
❌ Don't use `apiRequest` for public endpoints (use `publicApiRequest`)

✅ Use `publicApiRequest` for public endpoints (contact, register, etc.)  
✅ Use `apiRequest` for authenticated endpoints  
✅ Let the client handle CSRF automatically  
✅ Use relative URLs (/endpoint)  
✅ Use toast notifications for user feedback  
✅ Trust the automatic configuration
