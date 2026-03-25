# Quick Start Guide

Get up and running with the new API architecture in 5 minutes.

## 🚀 Step 1: Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios react-hot-toast lucide-react
```

## 🔧 Step 2: Environment Setup

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## 📦 Step 3: Add Providers

Update your `app/layout.tsx`:

```tsx
import { AppProviders } from '@/lib/providers/AppProviders';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

## 🎯 Step 4: Use in Your Components

### Example 1: Membership Application Form

```tsx
'use client';

import { useSubmitMembershipApplication } from '@/lib/hooks';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function MembershipForm() {
  const { mutate, isLoading } = useSubmitMembershipApplication();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    branch_id: 1,
    membership_type: 'general',
    nid_number: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(formData, {
      onSuccess: (response) => {
        toast.success('Application submitted successfully!');
        console.log('Application:', response.data.data);
        // Reset form or redirect
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Submission failed');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="NID Number"
        value={formData.nid_number}
        onChange={(e) => setFormData({ ...formData, nid_number: e.target.value })}
        required
      />
      <button 
        type="submit" 
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
```

### Example 2: Display Membership Applications

```tsx
'use client';

import { useMembershipApplications } from '@/lib/hooks';

export default function ApplicationsList() {
  const { data, isLoading, error } = useMembershipApplications({ 
    page: 1, 
    per_page: 15 
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading applications</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Membership Applications</h2>
      {data?.data.data.map((application) => (
        <div key={application.id} className="p-4 border rounded">
          <h3 className="font-semibold">{application.full_name}</h3>
          <p>{application.email}</p>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: User Profile

```tsx
'use client';

import { useMyProfile } from '@/lib/hooks';
import { AuthGuard } from '@/lib/components/AuthGuard';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile?.data.full_name}</p>
        <p><strong>Phone:</strong> {profile?.data.phone}</p>
        <p><strong>Email:</strong> {profile?.data.email}</p>
      </div>
    </div>
  );
}
```

### Example 4: Login Page

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest } from '@/lib/api/axios';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest.post('/public/login', {
        email,
        password
      });

      const { token, user } = response.data.data;
      login(token, user);
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## 🎨 Using Components

### OTP Input

```tsx
import { OtpInput } from '@/lib/components/OtpInput';

<OtpInput 
  length={6} 
  onComplete={(otp) => {
    console.log('OTP entered:', otp);
    // Verify OTP
  }} 
/>
```

### Notification Bell

```tsx
import { NotificationBell } from '@/lib/components/NotificationBell';
import { useNotification } from '@/lib/context/NotificationContext';

function Header() {
  const { unreadCount } = useNotification();
  
  return (
    <NotificationBell 
      count={unreadCount} 
      onClick={() => console.log('Show notifications')} 
    />
  );
}
```

### Countdown Timer

```tsx
import { CountdownTimer } from '@/lib/components/CountdownTimer';

<CountdownTimer 
  targetDate={new Date('2024-12-31T23:59:59')} 
  onComplete={() => alert('Time is up!')}
/>
```

## 🔐 Protected Routes

```tsx
import { AuthGuard } from '@/lib/components/AuthGuard';

// User route
export default function UserDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

// Admin route
export default function AdminPanel() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminContent />
    </AuthGuard>
  );
}
```

## 📱 Using Context

### Authentication

```tsx
import { useAuth } from '@/lib/context/AuthContext';

function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <LoginButton />;

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Notifications

```tsx
import { useNotification } from '@/lib/context/NotificationContext';

function NotificationButton() {
  const { addNotification } = useNotification();

  const handleClick = () => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Operation completed successfully'
    });
  };

  return <button onClick={handleClick}>Show Notification</button>;
}
```

### Shopping Cart

```tsx
import { useCart } from '@/lib/context/CartContext';

function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={() => addItem(product)}
        disabled={isInCart(product.id)}
      >
        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

## 🎯 Common Patterns

### Loading State

```tsx
const { data, isLoading, error } = useMyProfile();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <ProfileDisplay data={data} />;
```

### Mutation with Feedback

```tsx
const { mutate, isLoading } = useSubmitMembershipApplication();

mutate(data, {
  onSuccess: () => toast.success('Success!'),
  onError: () => toast.error('Failed!')
});
```

### Pagination

```tsx
const [page, setPage] = useState(1);
const { data } = useMembershipApplications({ page, per_page: 15 });

<button onClick={() => setPage(p => p - 1)}>Previous</button>
<button onClick={() => setPage(p => p + 1)}>Next</button>
```

## 📚 Next Steps

1. ✅ Read `lib/README.md` for comprehensive documentation
2. ✅ Check `lib/api/examples.ts` for more patterns
3. ✅ Review `API_ARCHITECTURE.md` for architecture details
4. ✅ Follow `MIGRATION_GUIDE.md` if migrating from old code

## 🆘 Troubleshooting

### Issue: "useAuth must be used within an AuthProvider"
**Solution**: Make sure `AppProviders` is wrapping your app in `layout.tsx`

### Issue: API calls returning 401
**Solution**: Check if token is being set correctly after login

### Issue: CORS errors
**Solution**: Verify `NEXT_PUBLIC_API_BASE_URL` and backend CORS settings

### Issue: TypeScript errors
**Solution**: Run `npm install` to ensure all types are installed

## 🎉 You're Ready!

You now have a professional, enterprise-grade API architecture. Start building amazing features!

For more examples and advanced usage, check the full documentation in `lib/README.md`.
