# Notification System - Testing Guide

## 🚀 Quick Start Testing (5 Minutes)

### Step 1: Verify Backend Setup
```bash
# In your Laravel backend directory

# 1. Check .env file has Pusher credentials
cat .env | grep PUSHER

# Should show:
# BROADCAST_CONNECTION=pusher
# PUSHER_APP_ID=2126256
# PUSHER_APP_KEY=a0b93b5b3a7936dfac19
# PUSHER_APP_SECRET=635607736d756d2555e8
# PUSHER_APP_CLUSTER=ap2

# 2. Start queue worker (IMPORTANT!)
php artisan queue:work
```

### Step 2: Start Frontend
```bash
# In your frontend directory
npm run dev
```

### Step 3: Test in Browser

#### A. Check Notification Bell
1. Login as admin or member
2. Look at the header - you should see a bell icon 🔔
3. If there are unread notifications, you'll see a red badge with count

#### B. Test Real-time Connection
1. Open browser console (F12)
2. Look for Pusher connection logs:
   ```
   Pusher: Connection established
   ```
3. If you see errors, check the troubleshooting section below

#### C. Send Test Notification
```bash
# In Laravel backend, open tinker
php artisan tinker

# Send a test notification (replace user ID)
$user = User::find(1);  // Change 1 to your user ID
$service = app(\App\Services\InAppNotificationService::class);
$service->send(
    $user,
    'Test Notification',
    'This is a test message from the system',
    'system_announcement',
    'bell',
    '/dashboard'
);
```

4. **Watch the magic!** 🎉
   - Notification should appear instantly in the bell dropdown
   - Unread count should update
   - No page refresh needed!

---

## 🧪 Detailed Testing Scenarios

### Scenario 1: Admin Dashboard Notifications

**Steps:**
1. Login as admin user
2. Navigate to `/admin`
3. Check notification bell in header
4. Click bell icon → dropdown should open
5. Click "View all notifications" → should go to `/admin/notifications`
6. Test filters: All / Unread
7. Test search functionality
8. Click "Mark all read" button
9. Delete a notification

**Expected Results:**
- ✅ Bell shows unread count
- ✅ Dropdown displays recent notifications
- ✅ Notifications page loads correctly
- ✅ Filters work properly
- ✅ Search finds matching notifications
- ✅ Mark all read updates UI instantly
- ✅ Delete removes notification

---

### Scenario 2: Member Dashboard Notifications

**Steps:**
1. Login as member user
2. Navigate to `/dashboard`
3. Check notification bell in header
4. Click bell icon → dropdown should open
5. Click sidebar "Notifications" link → should go to `/dashboard/notifications`
6. Test all features (same as admin)

**Expected Results:**
- ✅ Same functionality as admin
- ✅ Member-specific notifications shown
- ✅ Sidebar link works

---

### Scenario 3: Real-time Notification Flow

**Setup:**
1. Open two browser windows side by side
2. Window 1: Frontend (logged in)
3. Window 2: Backend tinker

**Test:**
```php
// In Window 2 (tinker)
$user = User::find(YOUR_USER_ID);
$service = app(\App\Services\InAppNotificationService::class);

// Send notification
$service->send($user, 'Payment Success', 'Your payment of ৳5000 was successful', 'payment_success', 'bell', '/dashboard/wallets');
```

**Watch Window 1:**
- ✅ Notification appears instantly (no refresh)
- ✅ Unread count increases
- ✅ Correct icon shows (✅ for payment_success)
- ✅ Clicking notification marks it as read
- ✅ Clicking notification navigates to action_url

---

### Scenario 4: Multiple Notification Types

**Test different notification types:**

```php
// Payment Success
$service->send($user, 'Payment Successful', 'Payment completed', 'payment_success', 'bell', null);

// Payment Failed
$service->send($user, 'Payment Failed', 'Payment was declined', 'payment_failed', 'bell', null);

// Commission Alert
$service->send($user, 'Commission Earned', 'You earned ৳500 commission', 'commission_alert', 'bell', '/dashboard/wallets');

// Pension Update
$service->send($user, 'Pension Updated', 'Your pension status changed', 'pension_update', 'bell', '/dashboard/pensions');

// Membership Approved
$service->send($user, 'Membership Approved', 'Welcome to the platform!', 'membership_approved', 'bell', null);

// System Announcement
$service->send($user, 'System Maintenance', 'Scheduled maintenance tonight', 'system_announcement', 'bell', null);
```

**Expected Results:**
- ✅ Each notification shows correct icon
- ✅ All appear in real-time
- ✅ Unread count updates correctly
- ✅ Can mark each as read
- ✅ Can delete each one

---

## 🔍 Browser Console Checks

### Check 1: Pusher Connection
```javascript
// Open console and check
console.log('Echo:', window.Echo);
console.log('Pusher:', window.Pusher);
```

**Expected Output:**
```
Echo: Echo {options: {...}, connector: {...}}
Pusher: function Pusher() {...}
```

### Check 2: Channel Subscription
```javascript
// After login, check active channels
// Look for: "private-notifications.{userId}"
```

### Check 3: Token Verification
```javascript
// Check if auth token exists
console.log('Token:', localStorage.getItem('auth_token'));
```

**Expected:** Should show a JWT token string

---

## ❌ Common Issues & Solutions

### Issue: "401 Unauthorized" Error

**Symptoms:**
- Console shows: `POST /broadcasting/auth 401`
- Notifications don't appear

**Solutions:**
1. Check if logged in: `localStorage.getItem('auth_token')`
2. Verify token is valid (not expired)
3. Check backend auth middleware
4. Verify API base URL in `.env.local`

---

### Issue 2: No Real-time Updates

**Symptoms:**
- Notifications only appear after page refresh
- No console logs from Pusher

**Solutions:**
1. **Check queue worker is running:**
   ```bash
   php artisan queue:work
   ```
   
2. **Verify Pusher credentials match:**
   - Frontend `.env.local`
   - Backend `.env`
   
3. **Check browser console for errors**

4. **Test Pusher connection manually:**
   ```javascript
   // In browser console
   const pusher = new Pusher('a0b93b5b3a7936dfac19', {
     cluster: 'ap2',
     forceTLS: true
   });
   
   pusher.connection.bind('connected', () => {
     console.log('✅ Pusher connected!');
   });
   
   pusher.connection.bind('error', (err) => {
     console.error('❌ Pusher error:', err);
   });
   ```

---

### Issue 3: Unread Count Not Updating

**Symptoms:**
- Badge shows wrong number
- Count doesn't decrease when marking as read

**Solutions:**
1. Check API response: `/api/v1/notifications/unread-count`
2. Verify `markAsRead` function is called
3. Check network tab for API calls
4. Clear browser cache and reload

---

### Issue 4: Dropdown Not Closing

**Symptoms:**
- Clicking outside doesn't close dropdown

**Solutions:**
1. Check browser console for errors
2. Verify `useEffect` cleanup is working
3. Try clicking the X button instead

---

## 📊 Testing Checklist

### Basic Functionality
- [ ] Notification bell appears in header
- [ ] Unread count badge shows correctly
- [ ] Clicking bell opens dropdown
- [ ] Clicking outside closes dropdown
- [ ] Notifications load in dropdown
- [ ] "View all" link works

### Real-time Features
- [ ] New notifications appear instantly
- [ ] Unread count updates in real-time
- [ ] No page refresh needed
- [ ] Multiple notifications work
- [ ] Works across browser tabs

### Notification Actions
- [ ] Click notification marks as read
- [ ] Blue dot disappears when read
- [ ] Unread count decreases
- [ ] Delete removes notification
- [ ] "Mark all read" works
- [ ] Action URL navigation works

### Notifications Page
- [ ] Page loads at `/admin/notifications`
- [ ] Page loads at `/dashboard/notifications`
- [ ] "All" filter shows all notifications
- [ ] "Unread" filter shows only unread
- [ ] Search finds matching notifications
- [ ] Empty state shows when no results
- [ ] Responsive on mobile

### Both Dashboards
- [ ] Admin dashboard has notification bell
- [ ] Member dashboard has notification bell
- [ ] Admin notifications page works
- [ ] Member notifications page works
- [ ] Sidebar link works for members

### Error Handling
- [ ] Graceful handling of API errors
- [ ] Loading states show correctly
- [ ] Empty states show correctly
- [ ] Network errors don't crash app

---

## 🎯 Performance Testing

### Test 1: Many Notifications
1. Send 50+ test notifications
2. Check if page loads quickly
3. Verify scrolling is smooth
4. Check memory usage in DevTools

### Test 2: Rapid Notifications
1. Send 10 notifications quickly (1 per second)
2. Verify all appear
3. Check for duplicates
4. Verify unread count is accurate

### Test 3: Long Session
1. Keep browser open for 30+ minutes
2. Send notifications periodically
3. Verify connection stays alive
4. Check for memory leaks

---

## 🔐 Security Testing

### Test 1: Authorization
1. Try accessing another user's notifications
2. Should return 403 or empty list

### Test 2: Token Expiry
1. Wait for token to expire
2. Try to fetch notifications
3. Should redirect to login

### Test 3: XSS Prevention
1. Send notification with HTML/script tags
2. Verify content is escaped
3. No scripts should execute

---

## 📱 Mobile Testing

### Test on Mobile Devices
- [ ] Notification bell visible
- [ ] Dropdown opens correctly
- [ ] Touch interactions work
- [ ] Responsive layout
- [ ] Search input works
- [ ] Filters work
- [ ] Scrolling smooth

---

## 🎉 Success Criteria

Your notification system is working correctly if:

1. ✅ Notifications appear **instantly** without refresh
2. ✅ Unread count updates in **real-time**
3. ✅ All CRUD operations work (read, delete)
4. ✅ Works for **both admin and member** dashboards
5. ✅ **No console errors**
6. ✅ **Responsive** on all screen sizes
7. ✅ **Graceful error handling**
8. ✅ **Good performance** with many notifications

---

## 🆘 Need Help?

### Debug Mode
Add this to see detailed logs:
```javascript
// In lib/echo.ts, add:
Pusher.logToConsole = true;
```

### Check Backend Logs
```bash
tail -f storage/logs/laravel.log
```

### Check Queue Jobs
```bash
php artisan queue:failed
```

### Network Tab
1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Check for Pusher connection
4. Look for `/broadcasting/auth` calls

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review `NOTIFICATION_IMPLEMENTATION_SUMMARY.md`
3. Check `NOTIFICATION_FRONTEND_QUICK_START.md`
4. Review browser console errors
5. Check backend logs

---

**Happy Testing! 🚀**
