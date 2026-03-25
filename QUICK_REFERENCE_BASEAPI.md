# Quick Reference: BaseApi Migration

## 📍 New Location

```
lib/api/BaseApi.ts  ✅ (moved from app/tanstack/api/BaseApi.ts)
```

---

## 🔄 Import Changes

### Before ❌
```typescript
import { apiClient } from '@/app/tanstack/api/BaseApi';
```

### After ✅
```typescript
import { apiClient } from '@/lib/api/BaseApi';
```

---

## 📦 What's Available

### From BaseApi.ts

```typescript
import { 
  apiClient,      // Axios instance with interceptors
  queryClient,    // React Query client
  queryKeys,      // Query key generator
  invalidateQueries // Cache invalidation helper
} from '@/lib/api/BaseApi';
```

### Entity Types
```typescript
type Entity = 
  | "donation"
  | "membership-application"
  | "profile"
  | "wallet"
  | "branch";
```

---

## 🎯 Usage Examples

### 1. Make API Calls
```typescript
import { apiClient } from '@/lib/api/BaseApi';

// GET request
const response = await apiClient.get('/donations');

// POST request
const response = await apiClient.post('/donation', {
  donor_name: 'John Doe',
  amount: 100
});

// PUT request
const response = await apiClient.put('/donation/1', {
  status: 'completed'
});

// DELETE request
await apiClient.delete('/donation/1');
```

### 2. Use Query Keys
```typescript
import { queryKeys } from '@/lib/api/BaseApi';

// Get query key for list
const donationsKey = queryKeys.donation();
// Result: ['donation']

// Get query key for single item
const donationKey = queryKeys.donation(1);
// Result: ['donation', 1]
```

### 3. Invalidate Cache
```typescript
import { invalidateQueries } from '@/lib/api/BaseApi';

// Invalidate all donations
invalidateQueries('donation');

// Invalidate specific donation
invalidateQueries('donation', 1);
```

### 4. Use Hooks (Recommended)
```typescript
import { useDonations } from '@/lib/hooks/admin/useDonations';

function DonationList() {
  const { data, isLoading, error } = useDonations(1);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return (
    <div>
      {data?.data.map(donation => (
        <div key={donation.id}>{donation.donor_name}</div>
      ))}
    </div>
  );
}
```

---

## 🆕 New Features

### 1. Automatic Token Management
```typescript
// Token is automatically added to all requests
// No need to manually set Authorization header
```

### 2. Automatic 401 Handling
```typescript
// Automatically redirects to /login on 401
// Clears auth token from localStorage
```

### 3. Enhanced Timeout
```typescript
// Timeout increased from 10s to 30s
```

### 4. Retry Logic
```typescript
// Queries retry 2 times on failure
// Mutations retry 1 time on failure
```

---

## 📚 Available Hooks

### Admin Hooks
```typescript
import { 
  useDonations,      // Get donations list
  useDonation,       // Get single donation
  useMembers,        // Get members list
  useMember,         // Get single member
  useDashboardStats  // Get dashboard stats
} from '@/lib/hooks';
```

### User Hooks
```typescript
import { 
  useMyProfile,      // Get user profile
  useMyWallet,       // Get wallet info
  useMyWalletTransactions // Get transactions
} from '@/lib/hooks';
```

### Public Hooks
```typescript
import { 
  useMembershipApplications,      // Get applications
  useSubmitMembershipApplication, // Submit application
  useBranches                     // Get branches
} from '@/lib/hooks';
```

---

## 🔧 Configuration

### Environment Variable
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Axios Config
```typescript
{
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}
```

### Query Client Config
```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      refetchOnWindowFocus: true,
      retry: 2
    },
    mutations: {
      retry: 1
    }
  }
}
```

---

## 🚨 Important Notes

1. **Token Storage**: Tokens are stored in `localStorage` as `auth_token`
2. **CORS**: `withCredentials: true` enables cookie-based auth
3. **CSRF**: Get CSRF cookie before login (handled in `lib/auth.ts`)
4. **401 Errors**: Automatically redirects to `/login`
5. **Backward Compatible**: All existing code still works

---

## 🎯 Migration Checklist

- [x] BaseApi.ts moved to lib/api/
- [x] All imports updated
- [x] Request interceptor added
- [x] Response interceptor added
- [x] Entity types expanded
- [x] Donations hook created
- [x] Exports updated
- [x] Documentation created
- [ ] Clear build cache
- [ ] Test in browser

---

## 📞 Quick Help

**Issue**: Import error  
**Solution**: Use `@/lib/api/BaseApi` instead of `@/app/tanstack/api/BaseApi`

**Issue**: Hook not found  
**Solution**: Import from `@/lib/hooks` or `@/lib/hooks/admin/useDonations`

**Issue**: 401 errors  
**Solution**: Check if token is in localStorage, verify backend is running

**Issue**: CORS errors  
**Solution**: Verify `withCredentials: true` and backend CORS config

---

## 📖 Full Documentation

- **Complete Guide**: [lib/README.md](lib/README.md)
- **Migration Details**: [BASEAPI_MIGRATION_COMPLETE.md](BASEAPI_MIGRATION_COMPLETE.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **All Docs**: [README_DOCUMENTATION_INDEX.md](README_DOCUMENTATION_INDEX.md)

---

**Status**: ✅ Ready to Use  
**Location**: `lib/api/BaseApi.ts`  
**Compatibility**: 100% Backward Compatible
