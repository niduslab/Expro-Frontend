# Notification System - Backend API Requirements

## 🎯 Overview

This document outlines the required backend API endpoints for the notification system. The frontend implementation is complete and ready to integrate with these endpoints.

---

## 📋 Required API Endpoints

### 1. Notification Preferences

#### GET `/api/v1/notification-preferences`

**Description**: Fetch user's notification preferences for all notification types.

**Authentication**: Required (Bearer Token)

**Response Format**:
```json
{
  "success": true,
  "message": "Notification preferences retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "notification_type": "payment_success",
      "email_enabled": true,
      "sms_enabled": false,
      "push_enabled": true,
      "in_app_enabled": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "user_id": 123,
      "notification_type": "commission_alert",
      "email_enabled": true,
      "sms_enabled": true,
      "push_enabled": true,
      "in_app_enabled": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
    // ... more notification types
  ]
}
```

**Expected Notification Types**:
- `payment_success`
- `payment_failed`
- `commission_alert`
- `pension_update`
- `membership_approved`
- `membership_rejected`
- `system_announcement`
- `wallet_transaction`
- `document_uploaded`
- `event_reminder`

**Notes**:
- If a user doesn't have preferences set, return default values (all channels enabled)
- Create default preferences on first access if they don't exist

---

#### PUT `/api/v1/notification-preferences`

**Description**: Update user's notification preference for a specific type and channel.

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "notification_type": "payment_success",
  "email_enabled": false,
  "sms_enabled": true,
  "push_enabled": true,
  "in_app_enabled": true
}
```

**Notes**:
- Only include the channels you want to update
- Can update one or multiple channels at once
- `notification_type` is required

**Response Format**:
```json
{
  "success": true,
  "message": "Notification preference updated successfully",
  "data": {
    "id": 1,
    "user_id": 123,
    "notification_type": "payment_success",
    "email_enabled": false,
    "sms_enabled": true,
    "push_enabled": true,
    "in_app_enabled": true,
    "updated_at": "2024-01-15T11:45:00Z"
  }
}
```

**Validation Rules**:
- `notification_type`: required, string, must be valid type
- `email_enabled`: optional, boolean
- `sms_enabled`: optional, boolean
- `push_enabled`: optional, boolean
- `in_app_enabled`: optional, boolean

---

### 2. Admin Notification Logs

#### GET `/api/v1/admin/notification-logs`

**Description**: Fetch paginated notification logs with filtering (Admin only).

**Authentication**: Required (Bearer Token + Admin Role)

**Query Parameters**:
```
?page=1
&per_page=20
&user_id=123
&notification_type=payment_success
&channel=email
&status=delivered
&date_from=2024-01-01
&date_to=2024-01-31
&search=john
```

**All Parameters** (all optional):
- `page`: integer, default 1
- `per_page`: integer, default 20, max 100
- `user_id`: integer, filter by specific user
- `notification_type`: string, filter by notification type
- `channel`: enum (email, sms, push, in_app)
- `status`: enum (pending, sent, delivered, failed, read)
- `date_from`: date (YYYY-MM-DD), filter from date
- `date_to`: date (YYYY-MM-DD), filter to date
- `search`: string, search in user name, email, title, message

**Response Format**:
```json
{
  "success": true,
  "message": "Notification logs retrieved successfully",
  "data": [
    {
      "id": 1001,
      "user_id": 123,
      "user": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+8801712345678"
      },
      "notification_type": "payment_success",
      "channel": "email",
      "status": "delivered",
      "title": "Payment Successful",
      "message": "Your payment of ৳5000 has been processed successfully.",
      "sent_at": "2024-01-15T10:30:00Z",
      "delivered_at": "2024-01-15T10:30:15Z",
      "failed_at": null,
      "read_at": "2024-01-15T10:35:00Z",
      "error_message": null,
      "cost": 0.50,
      "metadata": {
        "payment_id": 456,
        "amount": 5000
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:35:00Z"
    }
    // ... more logs
  ],
  "current_page": 1,
  "last_page": 10,
  "per_page": 20,
  "total": 195,
  "from": 1,
  "to": 20
}
```

**Status Flow**:
- `pending`: Notification queued but not sent yet
- `sent`: Notification sent to provider (email/SMS service)
- `delivered`: Confirmed delivery by provider
- `failed`: Failed to send or deliver
- `read`: User opened/read the notification (in-app only)

---

#### GET `/api/v1/admin/notification-analytics`

**Description**: Get notification analytics and statistics (Admin only).

**Authentication**: Required (Bearer Token + Admin Role)

**Query Parameters**:
```
?from=2024-01-01
&to=2024-01-31
```

**Parameters** (all optional):
- `from`: date (YYYY-MM-DD), analytics from date
- `to`: date (YYYY-MM-DD), analytics to date
- If not provided, return last 30 days

**Response Format**:
```json
{
  "success": true,
  "message": "Notification analytics retrieved successfully",
  "data": {
    "total_sent": 15420,
    "total_delivered": 14890,
    "total_failed": 530,
    "total_pending": 125,
    "delivery_rate": 96.56,
    "failure_rate": 3.44,
    "total_cost": 2580.50,
    "by_type": {
      "payment_success": 4520,
      "commission_alert": 3210,
      "pension_update": 2890,
      "membership_approved": 1450,
      "system_announcement": 1200,
      "wallet_transaction": 980,
      "payment_failed": 670,
      "membership_rejected": 320,
      "document_uploaded": 120,
      "event_reminder": 60
    },
    "by_channel": {
      "in_app": 15420,
      "email": 8920,
      "sms": 2340,
      "push": 1890
    },
    "by_status": {
      "delivered": 14890,
      "failed": 530,
      "pending": 125,
      "sent": 890,
      "read": 8920
    },
    "recent_activity": [
      {
        "date": "2024-01-15",
        "count": 520
      },
      {
        "date": "2024-01-14",
        "count": 485
      }
      // ... last 7-30 days
    ]
  }
}
```

**Calculation Notes**:
- `delivery_rate`: (total_delivered / total_sent) * 100
- `failure_rate`: (total_failed / total_sent) * 100
- `by_channel`: Sum can be > total_sent (one notification can go to multiple channels)
- `total_cost`: Sum of all notification costs (SMS costs, email service costs, etc.)

---

## 🗄️ Database Schema Requirements

### Table: `notification_preferences`

```sql
CREATE TABLE notification_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_type (user_id, notification_type),
    INDEX idx_user_id (user_id)
);
```

### Table: `notification_logs`

```sql
CREATE TABLE notification_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    channel ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed', 'read') DEFAULT 'pending',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    failed_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    error_message TEXT NULL,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_channel (channel),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at),
    INDEX idx_created_at (created_at)
);
```

**Notes**:
- `metadata`: Store additional context (payment_id, amount, etc.) as JSON
- `cost`: Track SMS costs, email service costs, etc.
- Indexes on frequently queried columns for performance

---

## 🔧 Implementation Guidelines

### 1. Notification Preferences

**Controller**: `NotificationPreferenceController.php`

```php
<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NotificationPreference;

class NotificationPreferenceController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        
        // Get or create default preferences
        $preferences = NotificationPreference::firstOrCreateDefaults($userId);
        
        return response()->json([
            'success' => true,
            'message' => 'Notification preferences retrieved successfully',
            'data' => $preferences
        ]);
    }
    
    public function update(Request $request)
    {
        $validated = $request->validate([
            'notification_type' => 'required|string',
            'email_enabled' => 'sometimes|boolean',
            'sms_enabled' => 'sometimes|boolean',
            'push_enabled' => 'sometimes|boolean',
            'in_app_enabled' => 'sometimes|boolean',
        ]);
        
        $userId = $request->user()->id;
        
        $preference = NotificationPreference::updateOrCreate(
            [
                'user_id' => $userId,
                'notification_type' => $validated['notification_type']
            ],
            array_filter($validated, fn($key) => $key !== 'notification_type', ARRAY_FILTER_USE_KEY)
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Notification preference updated successfully',
            'data' => $preference
        ]);
    }
}
```

**Model**: `NotificationPreference.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'notification_type',
        'email_enabled',
        'sms_enabled',
        'push_enabled',
        'in_app_enabled',
    ];
    
    protected $casts = [
        'email_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
        'push_enabled' => 'boolean',
        'in_app_enabled' => 'boolean',
    ];
    
    public static function firstOrCreateDefaults($userId)
    {
        $types = [
            'payment_success',
            'payment_failed',
            'commission_alert',
            'pension_update',
            'membership_approved',
            'membership_rejected',
            'system_announcement',
            'wallet_transaction',
            'document_uploaded',
            'event_reminder',
        ];
        
        $preferences = [];
        foreach ($types as $type) {
            $preferences[] = self::firstOrCreate(
                ['user_id' => $userId, 'notification_type' => $type],
                [
                    'email_enabled' => true,
                    'sms_enabled' => true,
                    'push_enabled' => true,
                    'in_app_enabled' => true,
                ]
            );
        }
        
        return $preferences;
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

### 2. Admin Notification Logs

**Controller**: `Admin/NotificationLogController.php`

```php
<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NotificationLog;
use Illuminate\Support\Facades\DB;

class NotificationLogController extends Controller
{
    public function index(Request $request)
    {
        $query = NotificationLog::with('user:id,name,email,phone');
        
        // Apply filters
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('notification_type')) {
            $query->where('notification_type', $request->notification_type);
        }
        
        if ($request->has('channel')) {
            $query->where('channel', $request->channel);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('date_from')) {
            $query->whereDate('sent_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('sent_at', '<=', $request->date_to);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        $perPage = min($request->get('per_page', 20), 100);
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'message' => 'Notification logs retrieved successfully',
            'data' => $logs->items(),
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
            'from' => $logs->firstItem(),
            'to' => $logs->lastItem(),
        ]);
    }
    
    public function analytics(Request $request)
    {
        $from = $request->get('from', now()->subDays(30)->format('Y-m-d'));
        $to = $request->get('to', now()->format('Y-m-d'));
        
        $query = NotificationLog::whereBetween('created_at', [$from, $to]);
        
        $totalSent = $query->count();
        $totalDelivered = (clone $query)->where('status', 'delivered')->count();
        $totalFailed = (clone $query)->where('status', 'failed')->count();
        $totalPending = (clone $query)->where('status', 'pending')->count();
        
        $deliveryRate = $totalSent > 0 ? ($totalDelivered / $totalSent) * 100 : 0;
        $failureRate = $totalSent > 0 ? ($totalFailed / $totalSent) * 100 : 0;
        
        $totalCost = (clone $query)->sum('cost');
        
        $byType = (clone $query)
            ->select('notification_type', DB::raw('count(*) as count'))
            ->groupBy('notification_type')
            ->pluck('count', 'notification_type');
        
        $byChannel = (clone $query)
            ->select('channel', DB::raw('count(*) as count'))
            ->groupBy('channel')
            ->pluck('count', 'channel');
        
        $byStatus = (clone $query)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');
        
        $recentActivity = (clone $query)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Notification analytics retrieved successfully',
            'data' => [
                'total_sent' => $totalSent,
                'total_delivered' => $totalDelivered,
                'total_failed' => $totalFailed,
                'total_pending' => $totalPending,
                'delivery_rate' => round($deliveryRate, 2),
                'failure_rate' => round($failureRate, 2),
                'total_cost' => round($totalCost, 2),
                'by_type' => $byType,
                'by_channel' => $byChannel,
                'by_status' => $byStatus,
                'recent_activity' => $recentActivity,
            ]
        ]);
    }
}
```

**Model**: `NotificationLog.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $fillable = [
        'user_id',
        'notification_type',
        'channel',
        'status',
        'title',
        'message',
        'sent_at',
        'delivered_at',
        'failed_at',
        'read_at',
        'error_message',
        'cost',
        'metadata',
    ];
    
    protected $casts = [
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'failed_at' => 'datetime',
        'read_at' => 'datetime',
        'cost' => 'decimal:2',
        'metadata' => 'array',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

### 3. Routes

**routes/api.php**:

```php
// Notification Preferences (Authenticated Users)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/notification-preferences', [NotificationPreferenceController::class, 'index']);
    Route::put('/notification-preferences', [NotificationPreferenceController::class, 'update']);
});

// Admin Notification Logs (Admin Only)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/notification-logs', [Admin\NotificationLogController::class, 'index']);
    Route::get('/notification-analytics', [Admin\NotificationLogController::class, 'analytics']);
});
```

---

## 🔄 Integration with Existing Notification Service

When sending notifications through your `InAppNotificationService`, also create log entries:

```php
// In InAppNotificationService.php

public function send($user, $title, $message, $type, $icon, $actionUrl = null)
{
    // Check user preferences
    $preference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_type', $type)
        ->first();
    
    // Create in-app notification if enabled
    if (!$preference || $preference->in_app_enabled) {
        $notification = InAppNotification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'icon' => $icon,
            'action_url' => $actionUrl,
        ]);
        
        // Log the notification
        NotificationLog::create([
            'user_id' => $user->id,
            'notification_type' => $type,
            'channel' => 'in_app',
            'status' => 'delivered',
            'title' => $title,
            'message' => $message,
            'sent_at' => now(),
            'delivered_at' => now(),
            'cost' => 0,
        ]);
        
        // Broadcast real-time event
        broadcast(new NotificationCreated($notification))->toOthers();
    }
    
    // Send email if enabled
    if (!$preference || $preference->email_enabled) {
        $this->sendEmail($user, $title, $message, $type);
    }
    
    // Send SMS if enabled
    if (!$preference || $preference->sms_enabled) {
        $this->sendSMS($user, $title, $message, $type);
    }
}

private function sendEmail($user, $title, $message, $type)
{
    try {
        // Send email logic
        Mail::to($user->email)->send(new NotificationEmail($title, $message));
        
        NotificationLog::create([
            'user_id' => $user->id,
            'notification_type' => $type,
            'channel' => 'email',
            'status' => 'sent',
            'title' => $title,
            'message' => $message,
            'sent_at' => now(),
            'cost' => 0,
        ]);
    } catch (\Exception $e) {
        NotificationLog::create([
            'user_id' => $user->id,
            'notification_type' => $type,
            'channel' => 'email',
            'status' => 'failed',
            'title' => $title,
            'message' => $message,
            'sent_at' => now(),
            'failed_at' => now(),
            'error_message' => $e->getMessage(),
            'cost' => 0,
        ]);
    }
}
```

---

## ✅ Testing Checklist

### Notification Preferences
- [ ] GET `/api/v1/notification-preferences` returns all preferences
- [ ] Default preferences created on first access
- [ ] PUT `/api/v1/notification-preferences` updates single channel
- [ ] PUT `/api/v1/notification-preferences` updates multiple channels
- [ ] Validation errors returned for invalid data
- [ ] Unauthorized access returns 401

### Admin Notification Logs
- [ ] GET `/api/v1/admin/notification-logs` returns paginated logs
- [ ] Filtering by user_id works
- [ ] Filtering by notification_type works
- [ ] Filtering by channel works
- [ ] Filtering by status works
- [ ] Date range filtering works
- [ ] Search functionality works
- [ ] Pagination works correctly
- [ ] Non-admin users get 403 error

### Admin Analytics
- [ ] GET `/api/v1/admin/notification-analytics` returns correct stats
- [ ] Date range filtering works
- [ ] Calculations are accurate (delivery rate, failure rate)
- [ ] Grouping by type/channel/status works
- [ ] Recent activity data is correct
- [ ] Non-admin users get 403 error

---

## 🚀 Deployment Notes

1. **Run Migrations**: Create the new tables
2. **Seed Default Preferences**: For existing users
3. **Update Notification Service**: Integrate logging
4. **Test Endpoints**: Use Postman/Insomnia
5. **Monitor Performance**: Add indexes if queries are slow
6. **Set Up Cron Jobs**: Clean old logs periodically

---

## 📞 Support

If you have questions about the API requirements or need clarification, please contact the frontend team.

**Frontend Implementation Status**: ✅ Complete and ready for integration
**Backend Implementation Status**: ⏳ Pending

---

**Last Updated**: April 16, 2026
