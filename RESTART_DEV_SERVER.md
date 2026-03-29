# Restart Development Server

After updating the `.env.local` file, you need to restart the Next.js development server for the changes to take effect.

## Steps to Restart

### Option 1: Stop and Start
1. Press `Ctrl + C` in the terminal running the dev server
2. Run `npm run dev` again

### Option 2: Kill and Restart (if Ctrl+C doesn't work)
1. Find the process:
   ```bash
   # Windows PowerShell
   Get-Process -Name node | Stop-Process -Force
   
   # Or find by port
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Start the server again:
   ```bash
   npm run dev
   ```

## Verify Environment Variable

After restarting, you can verify the environment variable is loaded by:

1. Check the browser console when the login page loads
2. Look for the CSRF token fetch log: `Fetching CSRF token from: http://127.0.0.1:8000/sanctum/csrf-cookie`
3. Check the Network tab in browser DevTools for the CSRF cookie request

## Common Issues

### Issue: Still seeing old URL
**Solution**: Make sure you completely stopped the dev server and restarted it. Environment variables are only loaded on server start.

### Issue: CORS errors
**Solution**: Ensure your Laravel backend has CORS configured to allow requests from `http://localhost:3000`

### Issue: 404 on CSRF cookie
**Solution**: Verify your backend is running on `http://127.0.0.1:8000` and the `/sanctum/csrf-cookie` route is accessible

## Backend CORS Configuration

Make sure your Laravel backend has the following CORS configuration in `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
],

'supports_credentials' => true,
```

And in `.env`:
```env
SESSION_DOMAIN=127.0.0.1
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```
