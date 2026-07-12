# 🏗️ Notification System Architecture

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NOTIFICATION SYSTEM                           │
│                     (Complete Implementation)                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (✅ Complete)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Notification    │  │   Settings       │  │  Admin          │  │
│  │  Bell/Inbox      │  │   Page           │  │  Analytics      │  │
│  │                  │  │                  │  │                 │  │
│  │  • Real-time     │  │  • Preferences   │  │  • Logs Table   │  │
│  │  • Unread count  │  │  • 4 Channels    │  │  • Analytics    │  │
│  │  • Mark as read  │  │  • 10 Types      │  │  • Filters      │  │
│  │  • Delete        │  │  • Auto-save     │  │  • Charts       │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│           │                      │                      │            │
│           └──────────────────────┼──────────────────────┘            │
│                                  │                                   │
│                    ┌─────────────▼─────────────┐                    │
│                    │   Custom React Hooks      │                    │
│                    │                            │                    │
│                    │  • useNotifications        │                    │
│                    │  • useNotificationPrefs    │                    │
│                    │  • useNotificationLogs     │                    │
│                    │  • useNotificationAnalytics│                    │
│                    └─────────────┬─────────────┘                    │
│                                  │                                   │
└──────────────────────────────────┼───────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      API Layer (axios)      │
                    │                             │
                    │  • Authentication           │
                    │  • Error Handling           │
                    │  • Request/Response         │
                    └──────────────┬──────────────┘
                                   │
┌──────────────────────────────────┼───────────────────────────────────┐
│                          BACKEND (⏳ Pending)                        │
├──────────────────────────────────┼───────────────────────────────────┤
│                                  │                                   │
│                    ┌─────────────▼─────────────┐                    │
│                    │      API Endpoints        │                    │
│                    │                            │                    │
│                    │  GET  /notifications       │                    │
│                    │  PUT  /notifications/{id}  │                    │
│                    │  GET  /notification-prefs  │                    │
│                    │  PUT  /notification-prefs  │                    │
│                    │  GET  /admin/logs          │                    │
│                    │  GET  /admin/analytics     │                    │
│                    └─────────────┬─────────────┘                    │
│                                  │                                   │
│                    ┌─────────────▼─────────────┐                    │
│                    │      Controllers           │                    │
│                    │                            │                    │
│                    │  • NotificationController  │                    │
│                    │  • PreferenceController    │                    │
│                    │  • LogController (Admin)   │                    │
│                    └─────────────┬─────────────┘                    │
│                                  │                                   │
│                    ┌─────────────▼─────────────┐                    │
│                    │      Services              │                    │
│                    │                            │                    │
│                    │  • InAppNotificationSvc    │                    │
│                    │  • EmailNotificationSvc    │                    │
│                    │  • SMSNotificationSvc      │                    │
│                    │  • PushNotificationSvc     │                    │
│                    └─────────────┬─────────────┘                    │
│                                  │                                   │
│         ┌────────────────────────┼────────────────────────┐         │
│         │                        │                        │         │
│  ┌──────▼──────┐  ┌──────────────▼──────────┐  ┌────────▼──────┐  │
│  │  Database   │  │  Broadcasting (Pusher)  │  │  Queue System │  │
│  │             │  │                         │  │               │  │
│  │  • in_app_  │  │  • Real-time events     │  │  • Email jobs │  │
│  │    notifs   │  │  • Private channels     │  │  • SMS jobs   │  │
│  │  • notif_   │  │  • Authentication       │  │  • Push jobs  │  │
│  │    prefs    │  │                         │  │               │  │
│  │  • notif_   │  │                         │  │               │  │
│  │    logs     │  │                         │  │               │  │
│  └─────────────┘  └─────────────────────────┘  └───────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Viewing Notifications

```
User clicks bell
       │
       ▼
NotificationBell component
       │
       ▼
useNotifications hook
       │
       ▼
GET /api/v1/notifications
       │
       ▼
NotificationController
       │
       ▼
InAppNotification model
       │
       ▼
Database query
       │
       ▼
Return notifications
       │
       ▼
Display in dropdown
```

### 2. Real-time Notification

```
Backend event occurs
       │
       ▼
InAppNotificationService
       │
       ├─────────────────┬─────────────────┬─────────────────┐
       │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼
  In-App            Email             SMS              Push
  (instant)      (queued)          (queued)        (queued)
       │                 │                 │                 │
       ▼                 │                 │                 │
  Pusher broadcast       │                 │                 │
       │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼
  Laravel Echo      Queue Worker    Queue Worker    Queue Worker
       │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼
  Frontend          Email Service   SMS Service    Push Service
  receives event         │                 │                 │
       │                 ▼                 ▼                 ▼
       ▼            User's inbox    User's phone   User's device
  Update UI
  Show notification
  Increment count
```

### 3. Managing Preferences

```
User toggles switch
       │
       ▼
Settings page
       │
       ▼
useNotificationPreferences hook
       │
       ▼
Optimistic UI update (instant)
       │
       ▼
PUT /api/v1/notification-preferences
       │
       ▼
PreferenceController
       │
       ▼
NotificationPreference model
       │
       ▼
Database update
       │
       ▼
Return updated preference
       │
       ▼
Confirm UI update
```

### 4. Admin Analytics

```
Admin visits analytics page
       │
       ▼
NotificationLogsPage component
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
useNotificationLogs      useNotificationAnalytics
       │                         │
       ▼                         ▼
GET /admin/logs          GET /admin/analytics
       │                         │
       ▼                         ▼
LogController            LogController
       │                         │
       ▼                         ▼
NotificationLog model    Aggregate queries
       │                         │
       ▼                         ▼
Filtered query           Calculate stats
       │                         │
       ▼                         ▼
Return paginated logs    Return analytics
       │                         │
       ▼                         ▼
Display table            Display charts
```

---

## 🗄️ Database Schema

### Table: `in_app_notifications` (Existing ✅)

```sql
┌─────────────────────────────────────────────────────────┐
│ in_app_notifications                                    │
├─────────────────────────────────────────────────────────┤
│ id              BIGINT (PK)                             │
│ user_id         BIGINT (FK → users.id)                  │
│ title           VARCHAR(255)                            │
│ message         TEXT                                    │
│ type            VARCHAR(50)                             │
│ icon            VARCHAR(50)                             │
│ action_url      VARCHAR(255) NULL                       │
│ read            BOOLEAN DEFAULT FALSE                   │
│ created_at      TIMESTAMP                               │
│ updated_at      TIMESTAMP                               │
└─────────────────────────────────────────────────────────┘
```

### Table: `notification_preferences` (New ⏳)

```sql
┌─────────────────────────────────────────────────────────┐
│ notification_preferences                                │
├─────────────────────────────────────────────────────────┤
│ id                  BIGINT (PK)                         │
│ user_id             BIGINT (FK → users.id)              │
│ notification_type   VARCHAR(50)                         │
│ email_enabled       BOOLEAN DEFAULT TRUE                │
│ sms_enabled         BOOLEAN DEFAULT TRUE                │
│ push_enabled        BOOLEAN DEFAULT TRUE                │
│ in_app_enabled      BOOLEAN DEFAULT TRUE                │
│ created_at          TIMESTAMP                           │
│ updated_at          TIMESTAMP                           │
│                                                         │
│ UNIQUE (user_id, notification_type)                    │
│ INDEX (user_id)                                        │
└─────────────────────────────────────────────────────────┘
```

### Table: `notification_logs` (New ⏳)

```sql
┌─────────────────────────────────────────────────────────┐
│ notification_logs                                       │
├─────────────────────────────────────────────────────────┤
│ id                  BIGINT (PK)                         │
│ user_id             BIGINT (FK → users.id)              │
│ notification_type   VARCHAR(50)                         │
│ channel             ENUM(email,sms,push,in_app)         │
│ status              ENUM(pending,sent,delivered,...)    │
│ title               VARCHAR(255)                        │
│ message             TEXT                                │
│ sent_at             TIMESTAMP NULL                      │
│ delivered_at        TIMESTAMP NULL                      │
│ failed_at           TIMESTAMP NULL                      │
│ read_at             TIMESTAMP NULL                      │
│ error_message       TEXT NULL                           │
│ cost                DECIMAL(10,2) DEFAULT 0.00          │
│ metadata            JSON NULL                           │
│ created_at          TIMESTAMP                           │
│ updated_at          TIMESTAMP                           │
│                                                         │
│ INDEX (user_id)                                        │
│ INDEX (notification_type)                              │
│ INDEX (channel)                                        │
│ INDEX (status)                                         │
│ INDEX (sent_at)                                        │
│ INDEX (created_at)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

### Authentication Flow

```
User Request
     │
     ▼
Bearer Token in Header
     │
     ▼
Laravel Sanctum Middleware
     │
     ├─── Valid? ───┐
     │              │
     ▼              ▼
   Reject        Accept
   (401)           │
                   ▼
              Check Permissions
                   │
                   ├─── Admin Route? ───┐
                   │                    │
                   ▼                    ▼
              User Route          Admin Check
                   │                    │
                   │              ├─── Is Admin? ───┐
                   │              │                  │
                   │              ▼                  ▼
                   │           Accept            Reject
                   │              │              (403)
                   │              │
                   └──────────────┴──────────────────┐
                                                     │
                                                     ▼
                                              Process Request
                                                     │
                                                     ▼
                                              Return Response
```

### Data Access Control

```
┌─────────────────────────────────────────────────────────┐
│                    Access Control                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Actions:                                           │
│  ✅ View own notifications                               │
│  ✅ Mark own notifications as read                       │
│  ✅ Delete own notifications                             │
│  ✅ View own preferences                                 │
│  ✅ Update own preferences                               │
│  ❌ View other users' notifications                      │
│  ❌ View notification logs                               │
│  ❌ View analytics                                       │
│                                                          │
│  Admin Actions:                                          │
│  ✅ All user actions                                     │
│  ✅ View all notifications                               │
│  ✅ View notification logs                               │
│  ✅ View analytics                                       │
│  ✅ Filter by any user                                   │
│  ✅ Export reports                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Component Hierarchy

### Frontend Component Tree

```
App
│
├── AdminLayout
│   │
│   ├── AdminHeader
│   │   └── NotificationBell ✅
│   │       ├── useNotifications hook
│   │       ├── Real-time listener
│   │       └── Dropdown menu
│   │
│   ├── AdminSidebar
│   │   ├── Notifications link
│   │   ├── Notification Analytics link
│   │   └── Settings link
│   │
│   └── Content
│       │
│       ├── /admin/notifications ✅
│       │   ├── Search bar
│       │   ├── Filter buttons
│       │   └── Notifications list
│       │
│       ├── /admin/notification-logs ✅ NEW
│       │   ├── Analytics cards
│       │   ├── Distribution charts
│       │   ├── Filter panel
│       │   ├── Logs table
│       │   └── Pagination
│       │
│       └── /admin/settings/notifications ✅ NEW
│           ├── Info banner
│           ├── Channel legend
│           └── Preferences table
│               ├── Category sections
│               └── Toggle switches
│
└── DashboardLayout
    │
    ├── DashboardHeader
    │   └── NotificationBell ✅
    │
    ├── DashboardSidebar
    │   ├── Notifications link
    │   └── Settings link
    │
    └── Content
        │
        ├── /dashboard/notifications ✅
        │   └── (Same as admin)
        │
        └── /dashboard/settings/notifications ✅ NEW
            └── (Same as admin)
```

---

## 🔄 State Management

### Hook Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                   useNotifications                       │
├─────────────────────────────────────────────────────────┤
│  State:                                                  │
│  • notifications: Notification[]                         │
│  • unreadCount: number                                   │
│  • isLoading: boolean                                    │
│  • connectionState: string                               │
│                                                          │
│  Effects:                                                │
│  • Fetch notifications on mount                          │
│  • Subscribe to real-time channel                        │
│  • Update on new notification                            │
│  • Cleanup on unmount                                    │
│                                                          │
│  Methods:                                                │
│  • markAsRead(id)                                        │
│  • markAllAsRead()                                       │
│  • deleteNotification(id)                                │
│  • refetch()                                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              useNotificationPreferences                  │
├─────────────────────────────────────────────────────────┤
│  State:                                                  │
│  • preferences: NotificationPreference[]                 │
│  • isLoading: boolean                                    │
│  • error: string | null                                  │
│                                                          │
│  Effects:                                                │
│  • Fetch preferences on mount                            │
│                                                          │
│  Methods:                                                │
│  • updatePreference(type, channel, enabled)              │
│  • updateAllChannels(type, settings)                     │
│  • refetch()                                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                useNotificationLogs                       │
├─────────────────────────────────────────────────────────┤
│  State:                                                  │
│  • logs: NotificationLog[]                               │
│  • pagination: PaginationData                            │
│  • filters: NotificationLogsFilters                      │
│  • isLoading: boolean                                    │
│  • error: string | null                                  │
│                                                          │
│  Effects:                                                │
│  • Fetch logs when filters change                        │
│                                                          │
│  Methods:                                                │
│  • updateFilters(newFilters)                             │
│  • changePage(page)                                      │
│  • resetFilters()                                        │
│  • refetch()                                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             useNotificationAnalytics                     │
├─────────────────────────────────────────────────────────┤
│  State:                                                  │
│  • analytics: NotificationAnalytics | null               │
│  • isLoading: boolean                                    │
│  • error: string | null                                  │
│                                                          │
│  Effects:                                                │
│  • Fetch analytics on mount                              │
│  • Refetch when date range changes                       │
│                                                          │
│  Methods:                                                │
│  • refetch()                                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────────────┐
│                    Development                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Next.js)                                      │
│  • localhost:3000                                        │
│  • Hot reload enabled                                    │
│  • Source maps enabled                                   │
│                                                          │
│  Backend (Laravel)                                       │
│  • localhost:8000                                        │
│  • Debug mode enabled                                    │
│  • Queue worker running                                  │
│                                                          │
│  Pusher                                                  │
│  • Development credentials                               │
│  • Debug console enabled                                 │
│                                                          │
│  Database                                                │
│  • Local MySQL/PostgreSQL                                │
│  • Seeded test data                                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                     Production                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vercel/Netlify)                               │
│  • CDN distribution                                      │
│  • Optimized builds                                      │
│  • Environment variables                                 │
│                                                          │
│  Backend (AWS/DigitalOcean)                              │
│  • Load balanced                                         │
│  • Queue workers (multiple)                              │
│  • Cron jobs for cleanup                                 │
│                                                          │
│  Pusher                                                  │
│  • Production credentials                                │
│  • SSL enabled                                           │
│  • Rate limiting                                         │
│                                                          │
│  Database                                                │
│  • Managed database service                              │
│  • Automated backups                                     │
│  • Read replicas                                         │
│                                                          │
│  Redis Cache                                             │
│  • Analytics caching                                     │
│  • Session storage                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Considerations

### Current Capacity

```
┌─────────────────────────────────────────────────────────┐
│              Estimated Performance                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Concurrent Users:        ~1,000 users                   │
│  Notifications/day:       ~50,000 notifications          │
│  Real-time connections:   ~500 concurrent                │
│  Database queries:        Optimized with indexes         │
│  API response time:       <200ms average                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Scaling Strategy

```
┌─────────────────────────────────────────────────────────┐
│                  Scaling Options                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Horizontal Scaling:                                     │
│  • Add more backend servers                              │
│  • Add more queue workers                                │
│  • Use load balancer                                     │
│                                                          │
│  Database Optimization:                                  │
│  • Add read replicas                                     │
│  • Partition logs table by date                          │
│  • Archive old data                                      │
│                                                          │
│  Caching:                                                │
│  • Cache analytics data (Redis)                          │
│  • Cache user preferences                                │
│  • CDN for static assets                                 │
│                                                          │
│  Queue Management:                                       │
│  • Separate queues by priority                           │
│  • Rate limit SMS/email                                  │
│  • Batch processing                                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary

### Architecture Highlights

✅ **Clean Separation**: Frontend and backend clearly separated  
✅ **Scalable Design**: Can handle growth with minimal changes  
✅ **Real-time Ready**: Pusher integration for instant updates  
✅ **Type-Safe**: TypeScript throughout frontend  
✅ **Well-Documented**: Complete API specifications  
✅ **Production-Ready**: Error handling, loading states, security  

### Next Steps

1. ⏳ Implement backend API endpoints
2. ⏳ Create database tables
3. ⏳ Test integration
4. ⏳ Deploy to production
5. ⏳ Monitor and optimize

---

**Last Updated**: April 16, 2026  
**Status**: Frontend Complete ✅ | Backend Pending ⏳
