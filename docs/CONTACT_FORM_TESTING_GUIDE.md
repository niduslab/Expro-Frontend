# Contact Form Testing Guide

## Quick Test Checklist

### 1. Form Validation ✓
- [ ] Submit empty form → See validation errors
- [ ] Enter invalid email → See email error
- [ ] Enter invalid phone → See phone error
- [ ] Enter message < 10 chars → See message error
- [ ] Fill all fields correctly → No validation errors

### 2. API Integration ✓
- [ ] Submit valid form → See success toast
- [ ] Check network tab → POST to `/contactmessage`
- [ ] Verify CSRF cookie → Check cookies in DevTools
- [ ] Check response → Should be 200 OK

### 3. User Experience ✓
- [ ] Success toast appears (green, bottom-right)
- [ ] Form clears after successful submission
- [ ] Error toast appears on API failure (red)
- [ ] No redirect to login page
- [ ] Submit button shows "Submitting..." during request
- [ ] Submit button is disabled during submission

### 4. Error Scenarios ✓
- [ ] Network error → See error toast
- [ ] Server error (500) → See error toast
- [ ] Validation error from API → See specific error
- [ ] CSRF token mismatch → Auto-retry and succeed

## Detailed Testing Steps

### Test 1: Validation Errors

1. Open contact page
2. Click "Submit Now" without filling anything
3. **Expected**: Toast shows "Please fill in all required fields correctly"
4. **Expected**: Red borders on all empty fields
5. **Expected**: Error messages below each field

### Test 2: Successful Submission

1. Fill in all fields with valid data:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Contact: +8801712345678
   - Address: Dhaka, Bangladesh
   - Message: This is a test message from the contact form.

2. Click "Submit Now"

3. **Expected**:
   - Button text changes to "Submitting..."
   - Button is disabled
   - After ~1-2 seconds, success toast appears
   - Toast message: "Thank you for your message! We will get back to you soon."
   - Form fields are cleared
   - Button returns to "Submit Now"

### Test 3: API Error Handling

1. Disconnect from internet or stop backend server
2. Fill in form and submit
3. **Expected**:
   - Error toast appears
   - Message: "Failed to send message. Please try again."
   - Form data is NOT cleared
   - User can retry

### Test 4: No Login Redirect

1. Make sure you're NOT logged in
2. Submit contact form
3. **Expected**:
   - Form submits normally
   - NO redirect to /login page
   - Stay on contact page
   - See success or error toast

### Test 5: CSRF Token Handling

1. Open DevTools → Network tab
2. Submit form
3. **Expected**:
   - First request: GET to `/sanctum/csrf-cookie`
   - Second request: POST to `/api/v1/contactmessage`
   - Both requests have `withCredentials: true`
   - XSRF-TOKEN cookie is set

### Test 6: Real-time Validation

1. Start typing in First Name field
2. **Expected**: Error message disappears as you type
3. Clear the field and move to next
4. **Expected**: Error reappears

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Network Conditions

Test under different conditions:
- [ ] Fast 3G
- [ ] Slow 3G
- [ ] Offline (should show error)

## Backend Testing

### Required Backend Setup

Ensure your Laravel backend has:

1. **CSRF Protection Enabled**
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000')),
```

2. **CORS Configuration**
```php
// config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:3000'],
```

3. **Contact Message Endpoint**
```php
// routes/api.php
Route::post('/contactmessage', [ContactMessageController::class, 'store']);
```

### Backend Response Format

Expected success response:
```json
{
  "success": true,
  "message": "Contact message received",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+8801712345678",
    "subject": "Contact Form Inquiry",
    "message": "This is a test message",
    "status": "unread",
    "created_at": "2024-03-15T10:00:00.000000Z"
  }
}
```

Expected error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "message": ["The message must be at least 10 characters."]
  }
}
```

## Debugging Tips

### Issue: Form redirects to login
**Check**: Are you using `publicApiRequest` instead of `apiRequest`?
```typescript
// ✅ Correct
import { publicApiRequest } from '@/lib/api/axios';
const response = await publicApiRequest.post('/contactmessage', data);

// ❌ Wrong
import { apiRequest } from '@/lib/api/axios';
const response = await apiRequest.post('/contactmessage', data);
```

### Issue: CSRF token mismatch
**Check**: 
1. Backend CORS configuration
2. `withCredentials: true` in axios config
3. SANCTUM_STATEFUL_DOMAINS includes your frontend domain

### Issue: Toast not appearing
**Check**:
1. Toaster component is in layout: `app/(public)/layout.tsx`
2. Toast import is correct: `import { toast } from 'sonner'`
3. Check browser console for errors

### Issue: Network error
**Check**:
1. Backend server is running
2. API URL is correct in `.env.local`
3. CORS is properly configured
4. Firewall/antivirus not blocking requests

## Console Logs for Debugging

Add these temporarily for debugging:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  console.log('Form data:', formData);
  
  try {
    console.log('Sending request...');
    const response = await publicApiRequest.post('/contactmessage', data);
    console.log('Response:', response.data);
    
    toast.success('Success!');
  } catch (error: any) {
    console.error('Error:', error);
    console.error('Error response:', error.response?.data);
    
    toast.error('Error occurred');
  }
};
```

## Success Criteria

All tests pass when:
- ✅ Form validates correctly
- ✅ Success toast appears on valid submission
- ✅ Error toast appears on failures
- ✅ No redirect to login page
- ✅ Form clears after success
- ✅ CSRF token is handled automatically
- ✅ Works in all major browsers
- ✅ Works on mobile devices

## Reporting Issues

If you find issues, report with:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Network tab screenshot
6. Backend logs (if available)
