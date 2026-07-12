# Frontend-Backend Connection Verification Checklist

## ✅ Completed Configurations

### 1. BaseApi Configuration
- [x] `withCredentials: true` added to axios client
- [x] `Accept: application/json` header added
- [x] Environment variable `NEXT_PUBLIC_API_BASE_URL` configured
- [x] Timeout set to 10 seconds

### 2. Authentication System
- [x] CSRF cookie request implemented
- [x] Real API login function (replaced mock)
- [x] Proper error handling
- [x] Logout function implemented
- [x] getCurrentUser function added
- [x] Removed manual cookie handling

### 3. Environment Setup
- [x] `.env.local` created with API URL
- [x] `.env.local.example` created for team
- [x] `.gitignore` already excludes `.env*` files

### 4. API Functions
- [x] Donation functions using apiClient
- [x] All API calls will include credentials automatically

## 🧪 Testing Steps

### Step 1: Backend Verification
```bash
# Ensure Laravel backend is running
cd /path/to/laravel-backend
php artisan serve

# Verify it's accessible at http://localhost:8000
```

### Step 2: Frontend Setup
```bash
# In your Next.js project
npm install  # If not already done
npm run dev  # Start development server
```

### Step 3: Test CORS Configuration
Open browser DevTools (F12) and check:

1. **Network Tab:**
   - Look for OPTIONS requests (CORS preflight)
   - Check response headers include `Access-Control-Allow-Origin`
   - Verify `Access-Control-Allow-Credentials: true`

2. **Console Tab:**
   - Should NOT see CORS errors
   - Should NOT see "blocked by CORS policy" messages

### Step 4: Test Authentication Flow

1. **Navigate to login page:**
   ```
   http://localhost:3000/login
   ```

2. **Open Network Tab in DevTools**

3. **Submit login form**

4. **Verify the following requests:**
   - ✅ GET `/sanctum/csrf-cookie` (Status: 204)
   - ✅ POST `/api/v1/public/login` (Status: 200)
   - ✅ Cookies are set in Application tab

5. **Check Application Tab → Cookies:**
   - Should see Laravel session cookie
   - Should see XSRF-TOKEN cookie

### Step 5: Test Authenticated Requests

After successful login:

1. **Navigate to a protected page** (e.g., `/admin/dashboard`)

2. **Check Network Tab:**
   - API requests should include cookies automatically
   - Should NOT get 401 Unauthorized errors

3. **Test API functions:**
   ```javascript
   // In browser console
   import { apiClient } from '@/app/tanstack/api/BaseApi';
   
   // This should work if authenticated
   apiClient.get('/myprofile').then(console.log);
   ```

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/v1/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Check Laravel `.env` has `CORS_ALLOWED_ORIGINS=http://localhost:3000`
2. Verify `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
3. Restart Laravel server after changing `.env`

### Issue: 419 CSRF Token Mismatch
**Symptoms:**
```
419 Page Expired / CSRF token mismatch
```

**Solutions:**
1. Ensure `/sanctum/csrf-cookie` is called BEFORE login
2. Check `withCredentials: true` is set
3. Clear browser cookies and try again
4. Verify Laravel session driver is working

### Issue: 401 Unauthorized
**Symptoms:**
```
401 Unauthorized on API requests
```

**Solutions:**
1. Check if login was successful
2. Verify cookies are being sent (Network tab → Headers)
3. Check Laravel middleware configuration
4. Ensure route is not protected by wrong guard

### Issue: Cookies Not Being Sent
**Symptoms:**
- No cookies in request headers
- Session not persisting

**Solutions:**
1. Verify `withCredentials: true` in BaseApi.ts
2. Check browser allows third-party cookies
3. Ensure frontend and backend are on same domain or CORS is configured
4. Check `SESSION_DOMAIN` in Laravel `.env`

### Issue: Environment Variable Not Found
**Symptoms:**
```
baseURL is undefined
```

**Solutions:**
1. Create `.env.local` file in project root
2. Add `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`
3. Restart Next.js dev server (environment variables are loaded at startup)

## 📋 Backend Requirements Checklist

Ensure your Laravel backend has:

- [ ] `fruitcake/laravel-cors` package installed
- [ ] `config/cors.php` properly configured
- [ ] `.env` has `CORS_ALLOWED_ORIGINS` set
- [ ] `.env` has `SANCTUM_STATEFUL_DOMAINS` set
- [ ] `.env` has `SESSION_DRIVER=database` (or redis)
- [ ] `.env` has `SESSION_HTTP_ONLY=true`
- [ ] `.env` has `SESSION_SAME_SITE=lax`
- [ ] Sanctum middleware configured in `bootstrap/app.php`
- [ ] Login route exists at `/api/v1/public/login`
- [ ] Protected routes use `auth:sanctum` middleware

## 🚀 Production Deployment

Before deploying to production:

### Frontend
- [ ] Update `.env.local` with production API URL
- [ ] Test with production backend
- [ ] Verify HTTPS is enabled
- [ ] Check environment variables are set in hosting platform

### Backend
- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Update `CORS_ALLOWED_ORIGINS` with production domain
- [ ] Update `SANCTUM_STATEFUL_DOMAINS` with production domain
- [ ] Enable HTTPS/SSL certificate
- [ ] Test CORS from production frontend
- [ ] Review rate limiting settings

## 📚 Documentation References

- [CORS_AND_SECURITY_SETUP.md](./CORS_AND_SECURITY_SETUP.md) - Backend CORS configuration
- [FRONTEND_BACKEND_CONNECTION.md](./FRONTEND_BACKEND_CONNECTION.md) - Frontend setup guide
- [Laravel Sanctum Docs](https://laravel.com/docs/11.x/sanctum)
- [Axios Docs](https://axios-http.com/docs/intro)

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ No CORS errors in browser console
2. ✅ Login redirects to dashboard
3. ✅ Cookies are set and sent automatically
4. ✅ Protected API routes return data (not 401)
5. ✅ Logout clears session properly
6. ✅ Page refresh maintains authentication state
