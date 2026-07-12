# Notification System - Frontend Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install laravel-echo pusher-js axios
```

### Step 2: Add Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_APP_CLUSTER=ap2
```

pusher creds: 
PUSHER_APP_ID=2126256
PUSHER_APP_KEY=a0b93b5b3a7936dfac19
PUSHER_APP_SECRET=635607736d756d2555e8
PUSHER_APP_CLUSTER=ap2

### Step 3: Create Echo Instance
```javascript
// lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
        },
    },
});
```

### Step 4: Use in Component
```javascript
import { useEffect, useState } from 'react';
import { echo } from '@/lib/echo';

export default function NotificationBell() {
    const [count, setCount] = useState(0);
    const userId = 1; // Get from your auth context

    useEffect(() => {
        // Subscribe to user's notification channel
        const channel = echo.private(`notifications.${userId}`);
        
        channel.listen('.notification.created', (notification) => {
            console.log('New notification:', notification);
            setCount(prev => prev + 1);
            
            // Show toast
            alert(`${notification.title}: ${notification.message}`);
        });

        return () => {
            channel.stopListening('.notification.created');
        };
    }, [userId]);

    return (
        <div>
            🔔 Notifications ({count})
        </div>
    );
}
```

---

## 📡 API Endpoints Reference

### Base URL
```
http://localhost:8000/api/v1/notifications
```

### Quick API Calls

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// Get all notifications
const notifications = await api.get('/notifications');

// Get unread count
const { data } = await api.get('/notifications/unread-count');
console.log(data.unread_count); // 5

// Mark as read
await api.put(`/notifications/${id}/read`);

// Mark all as read
await api.put('/notifications/mark-all-read');

// Delete notification
await api.delete(`/notifications/${id}`);
```

---

## 🎨 Complete Notification Bell Component

```javascript
// components/NotificationBell.jsx
import { useState, useEffect } from 'react';
import { echo } from '@/lib/echo';
import axios from 'axios';

export default function NotificationBell({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch initial data
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    // Real-time subscription
    useEffect(() => {
        if (!userId) return;

        const channel = echo.private(`notifications.${userId}`);
        
        channel.listen('.notification.created', (data) => {
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);
            showToast(data.title, data.message);
        });

        return () => {
            channel.stopListening('.notification.created');
        };
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/v1/notifications');
            setNotifications(data.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const { data } = await axios.get('/api/v1/notifications/unread-count');
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/v1/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/api/v1/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const showToast = (title, message) => {
        // Use your toast library here
        console.log(`Toast: ${title} - ${message}`);
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead(notification.id);
                                        }
                                        if (notification.action_url) {
                                            window.location.href = notification.action_url;
                                        }
                                    }}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                                        !notification.read ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="text-2xl">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatTime(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t text-center">
                        <a
                            href="/notifications"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View all notifications
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

function getIcon(type) {
    const icons = {
        payment_success: '✅',
        payment_failed: '❌',
        commission_alert: '💰',
        pension_update: 'ℹ️',
        membership_approved: '✅',
        membership_rejected: '❌',
        system_announcement: '📢',
    };
    return icons[type] || '🔔';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}
```

---

## 🧪 Testing Your Implementation

### 1. Test Backend Connection
```javascript
// In browser console
console.log('Echo:', echo);
console.log('Pusher:', echo.connector.pusher);

// Check connection status
echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Connected to Pusher!');
});

echo.connector.pusher.connection.bind('error', (err) => {
    console.error('❌ Pusher error:', err);
});
```

### 2. Test Channel Subscription
```javascript
const channel = echo.private('notifications.1');
console.log('Subscribed to:', channel.name);

channel.listen('.notification.created', (data) => {
    console.log('Received:', data);
});
```

### 3. Trigger Test Notification (Backend)
```php
// In Laravel Tinker: php artisan tinker

$user = User::find(1);
$service = app(\App\Services\InAppNotificationService::class);

$service->send(
    $user,
    'Test Notification',
    'This is a test message from backend',
    'test',
    'bell',
    '/test'
);
```

You should see the notification appear in real-time in your frontend!

---

## 🎯 Notification Types & Icons

| Type | Icon | Description |
|------|------|-------------|
| `payment_success` | ✅ | Payment completed |
| `payment_failed` | ❌ | Payment failed |
| `commission_alert` | 💰 | Commission earned |
| `pension_update` | ℹ️ | Pension status changed |
| `membership_approved` | ✅ | Application approved |
| `membership_rejected` | ❌ | Application rejected |
| `system_announcement` | 📢 | System announcement |

---

## 🔧 Common Issues & Solutions

### Issue: "401 Unauthorized" on broadcasting/auth
**Solution**: Make sure your Bearer token is correctly set in Echo config

```javascript
auth: {
    headers: {
        Authorization: `Bearer ${getToken()}`, // Make sure this returns valid token from localStorage.getItem('auth_token')
        Accept: 'application/json',
    },
}
```

### Issue: Notifications not appearing in real-time
**Solution**: Check these:
1. Is BROADCAST_CONNECTION set to 'pusher' in backend .env?
2. Are Pusher credentials correct?
3. Is the user ID correct in channel subscription?
4. Check browser console for errors

### Issue: "Channel not found" error
**Solution**: Verify the channel name format: `notifications.{userId}` (no spaces, correct user ID)

### Issue: Multiple duplicate notifications
**Solution**: Make sure you're cleaning up the listener in useEffect return

```javascript
useEffect(() => {
    const channel = echo.private(`notifications.${userId}`);
    channel.listen('.notification.created', handler);
    
    return () => {
        channel.stopListening('.notification.created'); // Important!
    };
}, [userId]);
```

---

## 📱 Mobile/PWA Support

### Add Desktop Notifications
```javascript
// Request permission
if ('Notification' in window) {
    Notification.requestPermission();
}

// Show desktop notification
function showDesktopNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '/notification-icon.png',
        });
    }
}

// Use in your listener
channel.listen('.notification.created', (data) => {
    showDesktopNotification(data.title, data.message);
});
```

---

## 🚀 Production Deployment

### Backend Checklist
```env
# .env (Production)
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=ap2
```

### Frontend Checklist
```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_PUSHER_APP_KEY=your_production_key
NEXT_PUBLIC_PUSHER_APP_CLUSTER=ap2
```

### Start Queue Workers (Backend)
```bash
php artisan queue:work --queue=default,notifications
```

---

## 📚 Additional Resources

- **Full Documentation**: See `NOTIFICATION_SYSTEM_DOCUMENTATION.md`
- **API Endpoints**: All endpoints documented in main doc
- **Backend Service**: `app/Services/InAppNotificationService.php`
- **Backend Controller**: `app/Http/Controllers/v1/NotificationController.php`

---

**Ready to implement?** Start with Step 1 and you'll have notifications working in 5 minutes! 🎉
