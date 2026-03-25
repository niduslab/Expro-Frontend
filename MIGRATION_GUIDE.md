# API Migration Guide

## Overview

This guide helps you migrate from the old API structure (`app/tanstack/api/BaseApi.ts`) to the new professional architecture in `lib/`.

## What Changed?

### Old Structure ❌
```
app/tanstack/api/
└── BaseApi.ts (everything in one file)
```

### New Structure ✅
```
lib/
├── api/
│   ├── axios.ts          # Axios configuration
│   └── examples.ts       # Usage examples
├── hooks/
│   ├── public/           # Public endpoints
│   ├── user/             # User endpoints
│   └── admin/            # Admin endpoints
├── components/           # Reusable components
├── context/              # React contexts
└── providers/            # Provider wrappers
```

## Migration Steps

### Step 1: Update Imports

**Before:**
```tsx
import { apiClient, queryClient } from '@/app/tanstack/api/BaseApi';
```

**After:**
```tsx
import { apiRequest } from '@/lib/api/axios';
import { useMyProfile } from '@/lib/hooks';
```

### Step 2: Replace Direct API Calls with Hooks

**Before:**
```tsx
const fetchProfile = async () => {
  const response = await apiClient.get('/myprofile');
  setProfile(response.data);
};

useEffect(() => {
  fetchProfile();
}, []);
```

**After:**
```tsx
const { data: profile, isLoading, error } = useMyProfile();
```

### Step 3: Update Mutations

**Before:**
```tsx
const submitApplication = async (data) => {
  try {
    const response = await apiClient.post('/public/membership-application', data);
    // Manual cache invalidation
    queryClient.invalidateQueries(['membership-applications']);
  } catch (error) {
    console.error(error);
  }
};
```

**After:**
```tsx
const { mutate, isLoading } = useSubmitMembershipApplication();

const submitApplication = (data) => {
  mutate(data, {
    onSuccess: (response) => {
      toast.success('Application submitted!');
      // Cache automatically invalidated
    },
    onError: (error) => {
      toast.error('Submission failed');
    }
  });
};
```

### Step 4: Setup Providers

Add to your `app/layout.tsx`:

```tsx
import { AppProviders } from '@/lib/providers/AppProviders';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
```

### Step 5: Update Authentication

**Before:**
```tsx
const token = localStorage.getItem('auth_token');
if (token) {
  apiClient.defaults.headers.Authorization = `Bearer ${token}`;
}
```

**After:**
```tsx
import { useAuth } from '@/lib/context/AuthContext';

const { login, logout, isAuthenticated } = useAuth();

// Login
login(token, userData);

// Logout
logout();
```

## Common Patterns

### Pattern 1: Fetching Data

**Before:**
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.get('/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**After:**
```tsx
const { data, isLoading, error } = useCustomHook();
```

### Pattern 2: Submitting Forms

**Before:**
```tsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (formData) => {
  setSubmitting(true);
  try {
    await apiClient.post('/endpoint', formData);
    alert('Success!');
  } catch (error) {
    alert('Error!');
  } finally {
    setSubmitting(false);
  }
};
```

**After:**
```tsx
const { mutate, isLoading } = useCustomMutation();

const handleSubmit = (formData) => {
  mutate(formData, {
    onSuccess: () => toast.success('Success!'),
    onError: () => toast.error('Error!')
  });
};
```

### Pattern 3: Pagination

**Before:**
```tsx
const [page, setPage] = useState(1);
const [data, setData] = useState([]);

useEffect(() => {
  apiClient.get(`/endpoint?page=${page}`).then(res => setData(res.data));
}, [page]);
```

**After:**
```tsx
const [page, setPage] = useState(1);
const { data, isLoading } = useCustomHook({ page, per_page: 15 });
```

## Benefits of New Architecture

1. **Type Safety**: Full TypeScript support with interfaces
2. **Automatic Caching**: React Query handles caching automatically
3. **Better Organization**: Domain-separated hooks
4. **Error Handling**: Consistent error handling patterns
5. **Loading States**: Built-in loading and error states
6. **Optimistic Updates**: Easy to implement
7. **Devtools**: React Query Devtools for debugging
8. **Reusability**: Hooks can be reused across components

## Checklist

- [ ] Install dependencies: `npm install @tanstack/react-query axios react-hot-toast`
- [ ] Setup environment variables in `.env.local`
- [ ] Add `AppProviders` to `app/layout.tsx`
- [ ] Replace direct API calls with hooks
- [ ] Update authentication logic
- [ ] Test all endpoints
- [ ] Remove old `app/tanstack/api/BaseApi.ts` (marked as deprecated)

## Need Help?

- Check `lib/api/examples.ts` for usage patterns
- Read `lib/README.md` for comprehensive documentation
- Review existing hooks in `lib/hooks/` for examples

## Rollback Plan

If you need to rollback, the old `BaseApi.ts` is still available but marked as deprecated. However, we recommend completing the migration for better maintainability.
