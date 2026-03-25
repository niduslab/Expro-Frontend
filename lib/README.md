# Frontend API Architecture

Professional, scalable API architecture using Axios and TanStack Query (React Query) for state management.

## 📁 Structure

```
lib/
├── api/
│   ├── axios.ts          # Axios configuration & interceptors
│   └── examples.ts       # Usage examples
├── hooks/
│   ├── index.ts          # Central export point
│   ├── public/           # Public endpoints (no auth)
│   │   ├── useMembership.ts
│   │   └── usePublicData.ts
│   ├── user/             # User endpoints (auth required)
│   │   ├── useProfile.ts
│   │   └── useWallet.ts
│   ├── admin/            # Admin endpoints
│   │   ├── useMembers.ts
│   │   └── useDashboard.ts
│   ├── useGSAPInit.ts
│   ├── usePageContent.ts
│   └── useTrackOrder.ts
├── components/           # Reusable components
│   ├── AuthGuard.tsx
│   ├── CountdownTimer.tsx
│   ├── NotificationBell.tsx
│   ├── OtpInput.tsx
│   └── ToastProvider.tsx
├── context/              # React contexts
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
└── providers/            # Provider wrappers
    ├── AppProviders.tsx
    ├── QueryProvider.tsx
    └── index.ts
```

## 🚀 Quick Start

### 1. Setup Providers

Wrap your app with providers in `app/layout.tsx`:

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

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Use Hooks in Components

```tsx
'use client';

import { useSubmitMembershipApplication } from '@/lib/hooks';
import { toast } from 'react-hot-toast';

export default function MembershipForm() {
  const { mutate, isLoading } = useSubmitMembershipApplication();

  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success('Application submitted successfully!');
        console.log(response.data);
      },
      onError: (error) => {
        toast.error('Failed to submit application');
        console.error(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## 📚 API Hooks

### Public Hooks (No Authentication)

#### Membership Applications

```tsx
import { 
  useMembershipApplications,
  useMembershipApplication,
  useSubmitMembershipApplication,
  useRegisterUser 
} from '@/lib/hooks';

// Get paginated applications
const { data, isLoading } = useMembershipApplications({ 
  page: 1, 
  per_page: 15 
});

// Get single application
const { data } = useMembershipApplication(1);

// Submit new application
const { mutate } = useSubmitMembershipApplication();
mutate({
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '8801712345678',
  branch_id: 1,
  membership_type: 'general',
  nid_number: '1234567890'
});

// Register user
const { mutate: register } = useRegisterUser();
register({
  email: 'user@example.com',
  password: 'SecurePass123!',
  password_confirmation: 'SecurePass123!',
  branch_id: 1
});
```

#### Public Data

```tsx
import { useBranches, useBranch } from '@/lib/hooks';

// Get all branches
const { data: branches } = useBranches();

// Get single branch
const { data: branch } = useBranch(1);
```

### User Hooks (Authentication Required)

#### Profile Management

```tsx
import { 
  useMyProfile,
  useCreateProfile,
  useUpdateProfile 
} from '@/lib/hooks';

// Get my profile
const { data: profile, isLoading } = useMyProfile();

// Create profile
const { mutate: createProfile } = useCreateProfile();
createProfile({
  full_name: 'John Doe',
  phone: '8801712345678',
  date_of_birth: '1990-01-15',
  gender: 'male',
  address: 'Dhaka, Bangladesh'
});

// Update profile
const { mutate: updateProfile } = useUpdateProfile();
updateProfile({
  id: 1,
  full_name: 'John Doe Updated'
});
```

#### Wallet Management

```tsx
import { useMyWallet, useMyWalletTransactions } from '@/lib/hooks';

// Get wallet
const { data: wallet } = useMyWallet();

// Get transactions
const { data: transactions } = useMyWalletTransactions({
  page: 1,
  type: 'credit',
  category: 'commission'
});
```

### Admin Hooks

```tsx
import { useMembers, useMember, useUpdateMemberStatus } from '@/lib/hooks';

// Get all members
const { data: members } = useMembers({ page: 1, status: 'active' });

// Get single member
const { data: member } = useMember(1);

// Update member status
const { mutate: updateStatus } = useUpdateMemberStatus();
updateStatus({ id: 1, status: 'active' });
```

## 🔐 Authentication

### Login Flow

```tsx
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest } from '@/lib/api/axios';

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const response = await apiRequest.post('/public/login', {
        email,
        password
      });
      
      const { token, user } = response.data.data;
      login(token, user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### Protected Routes

```tsx
import { AuthGuard } from '@/lib/components/AuthGuard';

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboard />
    </AuthGuard>
  );
}
```

## 🎨 Components

### OTP Input

```tsx
import { OtpInput } from '@/lib/components/OtpInput';

<OtpInput 
  length={6} 
  onComplete={(otp) => console.log('OTP:', otp)} 
/>
```

### Countdown Timer

```tsx
import { CountdownTimer } from '@/lib/components/CountdownTimer';

<CountdownTimer 
  targetDate={new Date('2024-12-31')} 
  onComplete={() => console.log('Time up!')}
/>
```

### Notification Bell

```tsx
import { NotificationBell } from '@/lib/components/NotificationBell';

<NotificationBell 
  count={5} 
  onClick={() => console.log('Clicked')} 
/>
```

## 🔧 Direct API Calls

For cases where you need direct API access without React Query:

```tsx
import { apiRequest } from '@/lib/api/axios';

// GET request
const response = await apiRequest.get('/myprofile');

// POST request
const response = await apiRequest.post('/memberprofile', {
  full_name: 'John Doe',
  phone: '8801712345678'
});

// PUT request
const response = await apiRequest.put('/memberprofile/1', {
  full_name: 'Updated Name'
});

// DELETE request
const response = await apiRequest.delete('/memberprofile/1');
```

## 🎯 Best Practices

1. **Use Hooks for Data Fetching**: Always prefer React Query hooks over direct API calls
2. **Handle Loading States**: Check `isLoading` and `isError` states
3. **Optimistic Updates**: Use `onMutate` for immediate UI feedback
4. **Error Handling**: Always provide `onError` callbacks
5. **Type Safety**: Use TypeScript interfaces for all data structures
6. **Cache Management**: React Query handles caching automatically

## 🔄 Migration from Old API

If you're using the old `app/tanstack/api/BaseApi.ts`:

**Before:**
```tsx
import { apiClient } from '@/app/tanstack/api/BaseApi';
const response = await apiClient.get('/myprofile');
```

**After:**
```tsx
import { useMyProfile } from '@/lib/hooks';
const { data, isLoading } = useMyProfile();
```

## 📖 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [API Documentation](../FRONTEND_API_DOCUMENTATION.md)

## 🤝 Contributing

When adding new endpoints:

1. Add types to the appropriate hook file
2. Create the hook following existing patterns
3. Export from `lib/hooks/index.ts`
4. Update this README with examples
