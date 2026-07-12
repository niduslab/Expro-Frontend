# CORS and Security Configuration

## Overview
Your Laravel API backend is now properly configured for CORS (Cross-Origin Resource Sharing) with HTTP-only cookies for secure authentication with mobile and web frontends.

## What Was Configured

### 1. CORS Configuration (`config/cors.php`)
- **Paths**: API routes and Sanctum CSRF cookie endpoint
- **Allowed Methods**: All HTTP methods (GET, POST, PUT, DELETE, etc.)
- **Allowed Origins**: Configurable via environment variable
- **Credentials Support**: Enabled for cookie-based authentication
- **Allowed Headers**: All headers accepted

### 2. Session Security (`.env`)
- **SESSION_HTTP_ONLY=true**: Cookies are HTTP-only (JavaScript cannot access them)
- **SESSION_SAME_SITE=lax**: CSRF protection while allowing normal navigation
- **SESSION_SECURE_COOKIE=false**: Set to `true` in production with HTTPS

### 3. Sanctum Configuration
- **Stateful Domains**: Configured for local development (localhost:3000, localhost:8080)
- **Cookie-based Authentication**: Enabled for SPA/mobile apps

### 4. Middleware Configuration (`bootstrap/app.php`)
- **HandleCors**: Added to API middleware group
- **EnsureFrontendRequestsAreStateful**: Sanctum middleware for cookie auth

## Environment Variables

### Development (.env)
```env
# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_SECURE_COOKIE=false

# Sanctum Stateful Domains
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000,localhost:8080,127.0.0.1:8080

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:8080,http://127.0.0.1:8080
```

### Production (.env)
```env
# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_SECURE_COOKIE=true  # IMPORTANT: Enable for HTTPS

# Sanctum Stateful Domains (Add your production domains)
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com,app.yourdomain.com

# CORS Allowed Origins (Add your production domains)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

## Frontend Integration

### Web Frontend (React/Vue/Angular)

#### 1. Install Axios
```bash
npm install axios
```

#### 2. Configure Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // IMPORTANT: Enable credentials
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;
```

#### 3. Authentication Flow
```javascript
// Get CSRF Cookie first
await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
  withCredentials: true
});

// Then login
const response = await api.post('/public/login', {
  email: 'user@example.com',
  password: 'password'
});

// Subsequent requests will automatically include the cookie
const profile = await api.get('/myprofile');
```

### Mobile Frontend (React Native)

#### 1. Install Axios
```bash
npm install axios react-native-cookies
```

#### 2. Configure Axios
```javascript
import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;
```

#### 3. Authentication Flow
```javascript
// Get CSRF Cookie
await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
  withCredentials: true
});

// Login
const response = await api.post('/public/login', {
  email: 'user@example.com',
  password: 'password'
});

// Store token if using token-based auth for mobile
const token = response.data.token;
```

### Flutter Mobile App

#### 1. Add Dependencies (pubspec.yaml)
```yaml
dependencies:
  http: ^1.1.0
  dio: ^5.3.3
  cookie_jar: ^4.0.8
  dio_cookie_manager: ^3.1.1
```

#### 2. Configure Dio
```dart
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';

final dio = Dio(BaseOptions(
  baseUrl: 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
));

final cookieJar = CookieJar();
dio.interceptors.add(CookieManager(cookieJar));
```

#### 3. Authentication Flow
```dart
// Get CSRF Cookie
await dio.get('http://localhost:8000/sanctum/csrf-cookie');

// Login
final response = await dio.post('/public/login', data: {
  'email': 'user@example.com',
  'password': 'password',
});
```

## Security Best Practices

### 1. HTTP-Only Cookies ✅
- Cookies cannot be accessed via JavaScript
- Protects against XSS attacks
- Already configured: `SESSION_HTTP_ONLY=true`

### 2. HTTPS in Production ⚠️
```env
# Production only
SESSION_SECURE_COOKIE=true
APP_URL=https://yourdomain.com
```

### 3. CORS Origins
- Never use `*` in production
- Specify exact domains in `CORS_ALLOWED_ORIGINS`
- Update `SANCTUM_STATEFUL_DOMAINS` with production domains

### 4. CSRF Protection
- Sanctum automatically handles CSRF for stateful requests
- SSLCommerz callbacks are excluded (already configured)

### 5. Rate Limiting
- Already configured: `throttle:10,1` (10 requests per minute)
- Adjust as needed for production

## Testing CORS

### Using cURL
```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:8000/api/v1/myprofile \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl -X GET http://localhost:8000/api/v1/myprofile \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v
```

### Using Postman
1. Set Origin header: `http://localhost:3000`
2. Enable "Send cookies" in settings
3. Test preflight and actual requests

## Common Issues & Solutions

### Issue 1: CORS Error "No 'Access-Control-Allow-Origin' header"
**Solution**: Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL

### Issue 2: Cookies Not Being Sent
**Solution**: 
- Set `withCredentials: true` in frontend
- Ensure `supports_credentials: true` in CORS config
- Check `SANCTUM_STATEFUL_DOMAINS` includes frontend domain

### Issue 3: CSRF Token Mismatch
**Solution**:
- Call `/sanctum/csrf-cookie` before authentication
- Ensure cookies are being stored and sent

### Issue 4: Mobile App Not Receiving Cookies
**Solution**:
- Use token-based authentication for mobile apps
- Or use a cookie manager library (shown above)

## Production Deployment Checklist

- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Update `APP_URL` to production domain
- [ ] Update `CORS_ALLOWED_ORIGINS` with production domains
- [ ] Update `SANCTUM_STATEFUL_DOMAINS` with production domains
- [ ] Enable HTTPS/SSL certificate
- [ ] Test CORS from production frontend
- [ ] Review rate limiting settings
- [ ] Remove test routes from `routes/api.php`

## Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
- [Laravel CORS Documentation](https://laravel.com/docs/11.x/routing#cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
