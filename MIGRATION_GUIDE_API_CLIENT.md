# API Client Migration Guide

This guide helps you migrate existing forms and API calls to use the centralized API client with automatic CSRF token handling.

## Why Migrate?

The centralized API client (`lib/api/axios.ts`) provides:

- ✅ Automatic CSRF token management (fixes "CSRF token mismatch" errors)
- ✅ Automatic retry on CSRF failures
- ✅ Consistent error handling across the app
- ✅ Authentication token management
- ✅ TypeScript type safety

## Migration Steps

### Step 1: Update Imports

**Before:**
```typescript
import axios from 'axios';
```

**After:**
```typescript
import { apiRequest } from '@/lib/api/axios';
```

### Step 2: Update API Calls

#### GET Requests

**Before:**
```typescript
const response = await axios.get(`${API_URL}/myprofile`);
```

**After:**
```typescript
const response = await apiRequest.get('/myprofile');
```

#### POST Requests

**Before:**
```typescript
const response = await axios.post(
  `${API_URL}/contactmessage`,
  { name: 'John', email: 'john@example.com' }
);
```

**After:**
```typescript
const response = await apiRequest.post('/contactmessage', {
  name: 'John',
  email: 'john@example.com',
});
```

#### PUT Requests

**Before:**
```typescript
const response = await axios.put(
  `${API_URL}/memberprofile/1`,
  { full_name: 'John Doe' }
);
```

**After:**
```typescript
const response = await apiRequest.put('/memberprofile/1', {
  full_name: 'John Doe',
});
```

#### DELETE Requests

**Before:**
```typescript
await axios.delete(`${API_URL}/nominee/1`);
```

**After:**
```typescript
await apiRequest.delete('/nominee/1');
```

### Step 3: Update Error Handling

**Before:**
```typescript
catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data?.message);
  }
}
```

**After:**
```typescript
catch (error: any) {
  if (error.response?.data?.message) {
    console.error(error.response.data.message);
  } else if (error.response?.data?.errors) {
    // Laravel validation errors
    const errorMessages = Object.values(error.response.data.errors).flat();
    console.error(errorMessages);
  }
}
```

### Step 4: Remove Manual CSRF Handling

If you have any manual CSRF token fetching, remove it:

**Remove this:**
```typescript
// Fetch CSRF token
await axios.get('/sanctum/csrf-cookie');

// Then make request
await axios.post('/api/endpoint', data);
```

**Replace with:**
```typescript
// CSRF is handled automatically
await apiRequest.post('/endpoint', data);
```

### Step 5: Remove Environment Variable References

**Before:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const response = await axios.get(`${API_URL}/myprofile`);
```

**After:**
```typescript
// API_URL is configured in lib/api/axios.ts
const response = await apiRequest.get('/myprofile');
```

## Complete Example: Contact Form Migration

### Before Migration

```typescript
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Manual CSRF token fetch
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });

      // Make API call
      const response = await axios.post(
        'http://localhost:8000/api/v1/contactmessage',
        {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello!',
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert('Success!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### After Migration

```typescript
'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api/axios';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // CSRF token is handled automatically
      const response = await apiRequest.post('/contactmessage', {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello!',
      });

      if (response.data.success) {
        alert('Success!');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## Files to Update

Search for these patterns in your codebase and update them:

1. **Direct axios imports**: `import axios from 'axios'`
2. **Manual CSRF calls**: `/sanctum/csrf-cookie`
3. **Hardcoded API URLs**: `http://localhost:8000/api/v1`
4. **Manual withCredentials**: `{ withCredentials: true }`

### Search Commands

```bash
# Find files using axios directly
grep -r "import axios" --include="*.tsx" --include="*.ts"

# Find manual CSRF token calls
grep -r "csrf-cookie" --include="*.tsx" --include="*.ts"

# Find hardcoded API URLs
grep -r "localhost:8000" --include="*.tsx" --include="*.ts"
```

## Common Patterns to Update

### Pattern 1: Login Form

**Before:**
```typescript
const response = await axios.post(`${API_URL}/public/login`, {
  email,
  password,
});
localStorage.setItem('auth_token', response.data.data.token);
```

**After:**
```typescript
import { apiRequest, authUtils } from '@/lib/api/axios';

const response = await apiRequest.post('/public/login', {
  email,
  password,
});
authUtils.setToken(response.data.data.token);
```

### Pattern 2: Authenticated Requests

**Before:**
```typescript
const token = localStorage.getItem('auth_token');
const response = await axios.get(`${API_URL}/myprofile`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

**After:**
```typescript
// Token is attached automatically
const response = await apiRequest.get('/myprofile');
```

### Pattern 3: File Uploads

**Before:**
```typescript
const formData = new FormData();
formData.append('file', file);

await axios.post(`${API_URL}/upload`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

**After:**
```typescript
const formData = new FormData();
formData.append('file', file);

await apiRequest.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

## Testing After Migration

1. **Test CSRF handling**: Submit a form and verify no CSRF errors
2. **Test authentication**: Login and make authenticated requests
3. **Test error handling**: Trigger validation errors and verify proper display
4. **Test retry logic**: Simulate CSRF mismatch (should auto-retry)

## Rollback Plan

If you encounter issues, you can temporarily revert by:

1. Keeping the old axios import
2. Adding manual CSRF token fetching
3. Reporting the issue for investigation

## Need Help?

- Check `lib/api/README.md` for detailed usage guide
- Review `components/public/contact/ContactFormSection.tsx` for a complete example
- Test in development before deploying to production

## Benefits After Migration

✅ No more CSRF token mismatch errors  
✅ Consistent error handling across all forms  
✅ Automatic retry on transient failures  
✅ Cleaner, more maintainable code  
✅ Better TypeScript support  
✅ Centralized authentication management
