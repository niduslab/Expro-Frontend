# 🔍 Notification System Debug Guide

## 🚨 Issue: Real-time notifications not working

**Symptoms:**
- Notifications only show after page refresh
- Real-time notifications not appearing
- WebSocket connection issues

---

## 🔧 Step-by-Step Debugging

### Step 1: Check Debug Panel

1. **Login to your admin/member dashboard**
2. **Look for the debug panel** in the bottom-right corner (black box)
3. **Check the connection status:**
   - ✅ **Green "connected"** = Good
   - 🟡 **Yellow "connecting"** = Trying to connect
   - 🔴 **Red "disconnected"** = Problem

### Step 2: Check Browser Console

1. **Open browser console** (F12 → Console tab)
2. **Look for these logs:**

**✅ Good logs (what you should see):**
```
🔄 Setting up real-time notifications for user: 1
🔑 Using token: eyJ0eXAiOiJKV1QiLCJh...
📡 Subscribing to channel: notifications.1
🆕 Creating new Echo instance
📡 Pusher Key: a0b93b5b3a7936dfac19
🌍 Pusher Cluster: ap2
🔗 Auth Endpoint: http://127.0.0.1:8000/broadcasting/auth
✅ Pusher connected successfully!
🔄 Pusher state change: disconnected → connected
✅ Real-time listener set up successfully
```

**❌ Bad logs (problems):**
```
⚠️ No userId provided, skipping real-time setup
⚠️ No auth token found, skipping real-time setup
🚨 Error setting up real-time notifications: [error]
❌ Pusher disconnected
🚨 Pusher connection error: [error]
```

### Step 3: Test Real-time Connection

1. **Send a test notification:**
   ```bash
   php artisan tinker
   
   $user = User::find(YOUR_USER_ID);
   $service = app(\App\Services\InAppNotificationService::class);
   $service->send($user, 'Test Real-time', 'This should appear instantly!', 'test', 'bell', '/');
   ```

2. **Watch the console for:**
   ```
   🎉 New notification received: {title: "Test Real-time", ...}
   📝 Adding notification to list. Current count: 2
   📊 Incrementing unread count from 1 to 2
   ```

3. **Check the UI:**
   - Badge count should increase immediately
   - Notification should appear in dropdown
   - No page refresh needed

---

## 🔍 Common Issues & Solutions

### Issue 1: No User ID

**Symptoms:**
```
⚠️ No userId provided, skipping real-time setup
```

**Solution:**
1. Check if user profile is loaded
2. Verify `profile?.id` exists
3. Check `useMyProfile` hook

**Debug:**
```javascript
// In browser console
console.log('Profile:', JSON.parse(localStorage.getItem('profile') || '{}'));
```

---

### Issue 2: No Auth Token

**Symptoms:**
```
⚠️ No auth token found, skipping real-time setup
```

**Solution:**
1. Check if user is logged in
2. Verify token exists in localStorage

**Debug:**
```javascript
// In browser console
console.log('Token:', localStorage.getItem('auth_token'));
```

**Fix:**
- If no token: Login again
- If token exists but old: Refresh login

---

### Issue 3: Pusher Connection Failed

**Symptoms:**
```
🚨 Pusher connection error: [error]
❌ Pusher disconnected
```

**Possible Causes:**
1. **Wrong Pusher credentials**
2. **Backend not configured**
3. **Network/firewall issues**
4. **CORS issues**

**Solutions:**

#### A. Check Frontend Environment
```bash
# Check .env.local
cat .env.local

# Should show:
NEXT_PUBLIC_PUSHER_APP_KEY=a0b93b5b3a7936dfac19
NEXT_PUBLIC_PUSHER_APP_CLUSTER=ap2
```

#### B. Check Backend Environment
```bash
# In Laravel directory
cat .env | grep PUSHER

# Should show:
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=2126256
PUSHER_APP_KEY=a0b93b5b3a7936dfac19
PUSHER_APP_SECRET=635607736d756d2555e8
PUSHER_APP_CLUSTER=ap2
```

#### C. Test Pusher Manually
```javascript
// In browser console
const pusher = new Pusher('a0b93b5b3a7936dfac19', {
  cluster: 'ap2',
  forceTLS: true
});

pusher.connection.bind('connected', () => {
  console.log('✅ Manual Pusher test: Connected!');
});

pusher.connection.bind('error', (err) => {
  console.error('❌ Manual Pusher test failed:', err);
});
```

---

### Issue 4: Authentication Failed

**Symptoms:**
```
POST /broadcasting/auth 401 (Unauthorized)
```

**Solution:**
1. **Check token validity:**
   ```javascript
   // Test API call
   fetch('/api/v1/notifications', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
       'Accept': 'application/json'
     }
   }).then(r => console.log('API test:', r.status));
   ```

2. **If 401:** Token expired, login again
3. **If 200:** Token good, check broadcasting auth endpoint

---

### Issue 5: Queue Worker Not Running

**Symptoms:**
- Notifications saved to database
- But not broadcasted in real-time

**Solution:**
```bash
# Check if queue worker is running
ps aux | grep "queue:work"

# If not running, start it:
php artisan queue:work

# Check for failed jobs:
php artisan queue:failed
```

---

## 🧪 Manual Testing Steps

### Test 1: Basic Connection
1. Login to dashboard
2. Open browser console
3. Look for connection logs
4. Check debug panel shows "connected"

### Test 2: API Endpoints
```javascript
// Test notifications API
fetch('/api/v1/notifications', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json'
  }
}).then(r => r.json()).then(console.log);

// Test unread count API
fetch('/api/v1/notifications/unread-count', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json'
  }
}).then(r => r.json()).then(console.log);
```

### Test 3: Broadcasting Auth
```javascript
// Test broadcasting auth endpoint
fetch('/broadcasting/auth', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channel_name: 'private-notifications.1',
    socket_id: 'test.123'
  })
}).then(r => console.log('Broadcasting auth:', r.status));
```

### Test 4: Send Test Notification
```bash
# Backend terminal
php artisan tinker

# Send notification
$user = User::find(1);
$service = app(\App\Services\InAppNotificationService::class);
$service->send($user, 'Debug Test', 'Testing real-time notifications', 'test', 'bell', '/dashboard');

# Check if job was queued
exit
php artisan queue:work --once
```

---

## 📋 Debugging Checklist

### Backend Requirements
- [ ] Laravel backend running
- [ ] Queue worker running: `php artisan queue:work`
- [ ] Pusher credentials in `.env`
- [ ] `BROADCAST_CONNECTION=pusher`
- [ ] Broadcasting routes registered
- [ ] CORS configured

### Frontend Requirements
- [ ] Pusher credentials in `.env.local`
- [ ] User logged in (token exists)
- [ ] User ID available
- [ ] No console errors
- [ ] Debug panel shows "connected"

### Network Requirements
- [ ] No firewall blocking WebSocket
- [ ] CORS allows WebSocket connections
- [ ] No proxy issues
- [ ] Internet connection stable

---

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Backend
php artisan queue:restart
php artisan queue:work

# Frontend
npm run dev
```

### Fix 2: Clear Cache
```bash
# Backend
php artisan config:clear
php artisan cache:clear

# Frontend
# Clear browser cache (Ctrl+Shift+R)
```

### Fix 3: Check Credentials
```bash
# Verify Pusher credentials match exactly
# Frontend .env.local vs Backend .env
```

### Fix 4: Test Different Browser
- Try Chrome, Firefox, Safari
- Check if browser blocks WebSocket
- Disable extensions temporarily

---

## 📞 Get Help

### If Still Not Working:

1. **Copy console logs** (all of them)
2. **Copy debug panel info**
3. **Check backend logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```
4. **Check queue status:**
   ```bash
   php artisan queue:failed
   ```

### Provide This Info:
- Browser console logs
- Debug panel screenshot
- Backend logs
- Environment files (without secrets)
- Steps you tried

---

## 🎯 Expected Working Flow

When everything works correctly:

1. **Page loads** → Debug panel shows "connecting"
2. **Pusher connects** → Debug panel shows "connected"
3. **Channel subscribed** → Console shows subscription logs
4. **Send notification** → Backend queues job
5. **Queue processes** → Notification broadcasted
6. **Frontend receives** → Console shows "New notification received"
7. **UI updates** → Badge count increases, notification appears

---

## 🚀 Success Indicators

✅ **Working correctly if:**
- Debug panel shows "connected"
- Console shows connection logs
- Test notification appears instantly
- Badge count updates without refresh
- No 401/403 errors in network tab

---

**Follow this guide step by step and you'll find the issue! 🔍**