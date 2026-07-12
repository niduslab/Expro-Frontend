# 🚀 Notification System - Quick Reference Card

## 📍 Routes

### User Routes
| Page | Route | Description |
|------|-------|-------------|
| Notifications | `/dashboard/notifications` | View all notifications |
| Settings | `/dashboard/settings/notifications` | Manage notification preferences |

### Admin Routes
| Page | Route | Description |
|------|-------|-------------|
| Notifications | `/admin/notifications` | View all notifications |
| Analytics | `/admin/notification-logs` | View logs and analytics |
| Settings | `/admin/settings/notifications` | Manage notification preferences |
| Test Page | `/admin/test-notifications` | Debug and test notifications |

---

## 🔌 API Endpoints

### User Endpoints
```
GET  /api/v1/notifications                    # Get user notifications
GET  /api/v1/notifications/unread-count       # Get unread count
PUT  /api/v1/notifications/{id}/read          # Mark as read
PUT  /api/v1/notifications/mark-all-read      # Mark all as read
DELETE /api/v1/notifications/{id}             # Delete notification

GET  /api/v1/notification-preferences         # Get preferences ⚠️ NEW
PUT  /api/v1/notification-preferences         # Update preferences ⚠️ NEW
```

### Admin Endpoints
```
GET  /api/v1/admin/notification-logs          # Get logs with filters ⚠️ NEW
GET  /api/v1/admin/notification-analytics     # Get analytics ⚠️ NEW
```

⚠️ **NEW** = Needs backend implementation

---

## 📦 Components

### Main Components
```tsx
// Notification Bell (in header)
import { NotificationBell } from "@/components/notifications/NotificationBell";
<NotificationBell userId={userId} />

// Full Notifications Page
// Already implemented at /admin/notifications and /dashboard/notifications

// Settings Page
// Already implemented at /admin/settings/notifications and /dashboard/settings/notifications

// Analytics Dashboard
// Already implemented at /admin/notification-logs
```

### Hooks
```tsx
// Get notifications
import { useNotifications } from "@/lib/hooks/useNotifications";
const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications(userId);

// Get preferences
import { useNotificationPreferences } from "@/lib/hooks/useNotificationPreferences";
const { preferences, updatePreference } = useNotificationPreferences();

// Get logs (admin only)
import { useNotificationLogs, useNotificationAnalytics } from "@/lib/hooks/admin/useNotificationLogs";
const { logs, pagination, filters, updateFilters } = useNotificationLogs();
const { analytics } = useNotificationAnalytics();
```

---

## 🎨 Notification Types

| Type | Icon | Category | Description |
|------|------|----------|-------------|
| `payment_success` | ✅ | Payments | Payment processed successfully |
| `payment_failed` | ❌ | Payments | Payment failed or declined |
| `commission_alert` | 💰 | Commissions | Commission earned |
| `pension_update` | ℹ️ | Pensions | Pension status changed |
| `membership_approved` | ✅ | Membership | Application approved |
| `membership_rejected` | ❌ | Membership | Application rejected |
| `system_announcement` | 📢 | System | System-wide announcement |
| `wallet_transaction` | 💳 | Wallet | Wallet activity |
| `document_uploaded` | 📄 | Documents | Document uploaded |
| `event_reminder` | 📅 | Events | Event reminder |

---

## 📊 Channels

| Channel | Icon | Description | Cost |
|---------|------|-------------|------|
| `in_app` | 🔔 | In-app notifications | Free |
| `email` | 📧 | Email notifications | Free |
| `sms` | 📱 | SMS notifications | Paid |
| `push` | 📲 | Push notifications | Free |

---

## 🎯 Status Types

| Status | Color | Description |
|--------|-------|-------------|
| `pending` | Yellow | Queued, not sent yet |
| `sent` | Blue | Sent to provider |
| `delivered` | Green | Confirmed delivery |
| `failed` | Red | Failed to send |
| `read` | Green | User opened notification |

---

## 🔧 Quick Commands

### Send Test Notification (Laravel Tinker)
```php
php artisan tinker

$user = User::find(1);
$service = app(\App\Services\InAppNotificationService::class);
$service->send(
    $user,
    'Test Notification',
    'This is a test message',
    'test',
    'bell',
    '/dashboard'
);
```

### Check Pusher Connection (Browser Console)
```javascript
// Check connection status
echo.connector.pusher.connection.state

// Test channel subscription
const channel = echo.private('notifications.1');
channel.listen('.notification.created', (data) => {
    console.log('Received:', data);
});
```

---

## 📝 Common Tasks

### Add New Notification Type

1. **Add to Frontend** (`app/(auth)/admin/settings/notifications/page.tsx`):
```tsx
{
  type: "new_notification_type",
  label: "New Notification",
  description: "Description of the notification",
  icon: "🔔",
  category: "Category Name",
}
```

2. **Add to Backend** (NotificationPreference model):
```php
$types = [
    // ... existing types
    'new_notification_type',
];
```

3. **Send Notification**:
```php
$service->send(
    $user,
    'Title',
    'Message',
    'new_notification_type',
    'icon',
    '/action-url'
);
```

---

## 🐛 Troubleshooting

### Notifications Not Appearing
1. Check Pusher connection: `/admin/test-notifications`
2. Verify auth token in localStorage
3. Check browser console for errors
4. Verify backend broadcasting is enabled

### Preferences Not Saving
1. Check API endpoint exists
2. Verify request payload format
3. Check network tab for errors
4. Verify authentication token

### Analytics Not Loading
1. Verify admin role/permissions
2. Check API endpoint exists
3. Verify date range format
4. Check backend logs for errors

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `NOTIFICATION_SYSTEM_IMPLEMENTATION_COMPLETE.md` | Complete overview |
| `NOTIFICATION_BACKEND_API_REQUIREMENTS.md` | Backend API specs |
| `NOTIFICATION_SYSTEM_ANALYSIS.md` | System analysis |
| `NOTIFICATION_FRONTEND_QUICK_START.md` | Quick start guide |
| `NOTIFICATION_QUICK_REFERENCE.md` | This file |

---

## ✅ Implementation Checklist

### Frontend (Complete ✅)
- [x] Notification bell component
- [x] Full notifications page
- [x] Settings page with preferences
- [x] Admin analytics dashboard
- [x] Real-time integration
- [x] All hooks and utilities

### Backend (Pending ⏳)
- [ ] Notification preferences API
- [ ] Notification logs API
- [ ] Analytics API
- [ ] Database tables
- [ ] Integration with notification service

---

## 🎉 Quick Stats

- **Total Files Created**: 5 new files
- **Total Files Updated**: 2 files
- **Lines of Code**: ~2,500+ lines
- **Components**: 3 major pages
- **Hooks**: 3 custom hooks
- **API Endpoints**: 4 new endpoints needed
- **Database Tables**: 2 new tables needed
- **Notification Types**: 10 types
- **Channels**: 4 channels
- **Status Types**: 5 statuses

---

## 🚀 Next Steps

1. **Backend Team**: Implement 4 API endpoints (see `NOTIFICATION_BACKEND_API_REQUIREMENTS.md`)
2. **Testing**: Test all features with real backend
3. **Deploy**: Deploy to production
4. **Monitor**: Monitor analytics dashboard for issues

---

**Status**: ✅ Frontend Complete | ⏳ Backend Pending
**Last Updated**: April 16, 2026
