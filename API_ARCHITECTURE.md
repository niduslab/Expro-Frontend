# API Architecture Documentation

## 🏗️ Architecture Overview

This document describes the professional frontend API architecture using Axios and TanStack Query.

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Application Layer                        │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages      │  │  Components  │  │   Layouts    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┼──────────────────┘                  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    Hooks Layer (React Query)                      │
│                            │                                      │
│  ┌─────────────────────────┼─────────────────────────────────┐  │
│  │                         │                                   │  │
│  │  ┌──────────────┐  ┌───┴────────┐  ┌──────────────┐      │  │
│  │  │   Public     │  │    User    │  │    Admin     │      │  │
│  │  │   Hooks      │  │   Hooks    │  │    Hooks     │      │  │
│  │  │              │  │            │  │              │      │  │
│  │  │ • Membership │  │ • Profile  │  │ • Members    │      │  │
│  │  │ • Branches   │  │ • Wallet   │  │ • Dashboard  │      │  │
│  │  └──────────────┘  └────────────┘  └──────────────┘      │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                      API Layer (Axios)                            │
│                            │                                      │
│  ┌─────────────────────────┼─────────────────────────────────┐  │
│  │                         │                                   │  │
│  │              ┌──────────▼──────────┐                       │  │
│  │              │   Axios Instance    │                       │  │
│  │              │   (apiRequest)      │                       │  │
│  │              └──────────┬──────────┘                       │  │
│  │                         │                                   │  │
│  │         ┌───────────────┼───────────────┐                 │  │
│  │         │               │               │                 │  │
│  │  ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐          │  │
│  │  │  Request    │ │ Response  │ │   Error     │          │  │
│  │  │ Interceptor │ │Interceptor│ │  Handling   │          │  │
│  │  │             │ │           │ │             │          │  │
│  │  │ • Auth      │ │ • Success │ │ • 401       │          │  │
│  │  │ • Headers   │ │ • Transform│ │ • 429       │          │  │
│  │  └─────────────┘ └───────────┘ └─────────────┘          │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    Context Layer                                  │
│                            │                                      │
│  ┌─────────────────────────┼─────────────────────────────────┐  │
│  │                         │                                   │  │
│  │  ┌──────────────┐  ┌───┴────────┐  ┌──────────────┐      │  │
│  │  │    Auth      │  │Notification│  │    Cart      │      │  │
│  │  │   Context    │  │  Context   │  │  Context     │      │  │
│  │  │              │  │            │  │              │      │  │
│  │  │ • Login      │  │ • Toast    │  │ • Items      │      │  │
│  │  │ • Logout     │  │ • Alerts   │  │ • Total      │      │  │
│  │  │ • User       │  │ • Messages │  │ • Actions    │      │  │
│  │  └──────────────┘  └────────────┘  └──────────────┘      │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Backend API   │
                    │  (Laravel/PHP)  │
                    └─────────────────┘
```

## 🔄 Data Flow

### Query Flow (GET Requests)

```
Component
   │
   ├─► useCustomHook()
   │      │
   │      ├─► React Query (Cache Check)
   │      │      │
   │      │      ├─► Cache Hit ──► Return Cached Data
   │      │      │
   │      │      └─► Cache Miss
   │      │             │
   │      │             ├─► apiRequest.get()
   │      │             │      │
   │      │             │      ├─► Request Interceptor (Add Auth)
   │      │             │      │
   │      │             │      ├─► Backend API
   │      │             │      │
   │      │             │      ├─► Response Interceptor
   │      │             │      │
   │      │             │      └─► Return Data
   │      │             │
   │      │             └─► Update Cache
   │      │
   │      └─► Return { data, isLoading, error }
   │
   └─► Render with Data
```

### Mutation Flow (POST/PUT/DELETE Requests)

```
Component
   │
   ├─► useMutation()
   │      │
   │      ├─► mutate(data)
   │      │      │
   │      │      ├─► onMutate (Optimistic Update)
   │      │      │
   │      │      ├─► apiRequest.post/put/delete()
   │      │      │      │
   │      │      │      ├─► Request Interceptor
   │      │      │      │
   │      │      │      ├─► Backend API
   │      │      │      │
   │      │      │      ├─► Response Interceptor
   │      │      │      │
   │      │      │      └─► Return Response
   │      │      │
   │      │      ├─► onSuccess
   │      │      │      │
   │      │      │      └─► Invalidate Queries (Refresh Cache)
   │      │      │
   │      │      └─► onError (Rollback if needed)
   │      │
   │      └─► Return { mutate, isLoading, error }
   │
   └─► Update UI
```

## 🎯 Key Features

### 1. Automatic Caching
- React Query caches all GET requests
- Configurable stale time (default: 5 minutes)
- Automatic background refetching

### 2. Request/Response Interceptors
- Automatic token attachment
- Global error handling
- Response transformation

### 3. Type Safety
- Full TypeScript support
- Interface definitions for all data types
- Type-safe API calls

### 4. Error Handling
- Centralized error handling
- Automatic retry logic
- User-friendly error messages

### 5. Loading States
- Built-in loading indicators
- Optimistic updates
- Skeleton screens support

## 📁 File Organization

### Hooks Structure

```
lib/hooks/
├── index.ts                 # Central export
├── public/                  # No auth required
│   ├── useMembership.ts    # Membership applications
│   └── usePublicData.ts    # Branches, public info
├── user/                    # User auth required
│   ├── useProfile.ts       # User profile
│   └── useWallet.ts        # Wallet & transactions
└── admin/                   # Admin auth required
    ├── useMembers.ts       # Member management
    └── useDashboard.ts     # Dashboard stats
```

### API Structure

```
lib/api/
├── axios.ts                 # Axios configuration
│   ├── apiClient           # Axios instance
│   ├── apiRequest          # Type-safe wrapper
│   └── authUtils           # Auth utilities
└── examples.ts             # Usage examples
```

## 🔐 Authentication Flow

```
1. User Login
   ├─► POST /public/login
   │      │
   │      └─► Response: { token, user }
   │
   ├─► authUtils.setToken(token)
   │
   ├─► AuthContext.login(token, user)
   │
   └─► Redirect to Dashboard

2. Authenticated Request
   ├─► Component calls useMyProfile()
   │
   ├─► Request Interceptor
   │      │
   │      ├─► Get token from localStorage
   │      │
   │      └─► Add Authorization header
   │
   ├─► Backend validates token
   │
   └─► Return user data

3. Token Expiry
   ├─► Backend returns 401
   │
   ├─► Response Interceptor catches 401
   │
   ├─► authUtils.removeToken()
   │
   └─► Redirect to /login
```

## 🚀 Performance Optimizations

1. **Request Deduplication**: Multiple components requesting same data = single API call
2. **Automatic Retries**: Failed requests retry automatically (configurable)
3. **Stale-While-Revalidate**: Show cached data while fetching fresh data
4. **Prefetching**: Prefetch data before user needs it
5. **Pagination**: Built-in pagination support

## 📊 Monitoring & Debugging

### React Query Devtools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Network Monitoring

All requests are logged in browser DevTools Network tab with:
- Request/Response headers
- Payload data
- Response time
- Status codes

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Query Client Configuration

```tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      refetchOnWindowFocus: true,   // Refetch on window focus
      retry: 2,                     // Retry failed requests 2 times
    },
    mutations: {
      retry: 1,                     // Retry failed mutations once
    },
  },
});
```

## 📚 Best Practices

1. **Always use hooks for data fetching**
2. **Handle loading and error states**
3. **Provide user feedback on mutations**
4. **Use optimistic updates for better UX**
5. **Keep hooks focused and single-purpose**
6. **Export types alongside hooks**
7. **Document hook parameters and return values**

## 🎓 Learning Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
