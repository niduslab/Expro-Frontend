# bKash Callback URL Configuration Guide

## Overview
After the user completes payment on bKash, bKash needs to redirect them back to your application. This requires configuring callback URLs on the backend when creating the payment.

## Current Flow

### 1. User Submits Form
```
User fills form → Clicks "Proceed to Payment" → Frontend submits to backend
```

### 2. Backend Creates Payment
```
Backend receives application data → Creates application record → Calls bKash API to create payment
```

### 3. Backend Returns Payment URL
```json
{
  "success": true,
  "message": "Membership application created. Please complete payment to submit.",
  "data": {
    "application": { "id": 21, ... },
    "payment": {
      "payment_id": 3,
      "payment_method": "bkash",
      "bkashURL": "https://sandbox.payment.bkash.com/...",
      "paymentID": "TR0011gSzegAk1775113185446",
      "amount": "500.00",
      "currency": "BDT"
    }
  }
}
```

### 4. Frontend Redirects to bKash
```javascript
window.location.href = paymentData.bkashURL;
// User leaves your site and goes to bKash
```

### 5. User Completes Payment on bKash
```
User enters bKash PIN → Confirms payment → bKash processes payment
```

### 6. bKash Redirects Back to Your Site
```
bKash redirects to: YOUR_CALLBACK_URL?status=success&paymentID=TR0011...
```

## Required Backend Configuration

### Callback URLs to Configure

When calling the bKash API to create a payment, the backend must provide these callback URLs:

#### Success URL (Required)
```
https://yourdomain.com/payment/bkash/callback?status=success
```

#### Failure/Cancel URL (Required)
```
https://yourdomain.com/payment/bkash/callback?status=failed
```

### Example Backend Code (Laravel)

```php
// When creating bKash payment
$bkashResponse = $bkashClient->createPayment([
    'amount' => $amount,
    'merchantInvoiceNumber' => $invoiceNumber,
    'intent' => 'sale',
    
    // IMPORTANT: Add these callback URLs
    'callbackURL' => config('app.url') . '/payment/bkash/callback?status=success',
    'cancelURL' => config('app.url') . '/payment/bkash/callback?status=failed',
]);
```

### Environment Variables

Add to your backend `.env`:

```env
# Development
APP_URL=http://localhost:3000
BKASH_CALLBACK_URL=${APP_URL}/payment/bkash/callback

# Production
APP_URL=https://yourdomain.com
BKASH_CALLBACK_URL=${APP_URL}/payment/bkash/callback
```

## Frontend Callback Handler

The frontend callback page (`/payment/bkash/callback`) is already implemented and handles:

### Success Flow
```
1. User redirected from bKash with ?status=success
2. Frontend reads payment_id from localStorage
3. Frontend calls: POST /api/v1/public/membership-application/payment-success
4. Backend verifies payment with bKash
5. Backend updates application status to "submitted"
6. Frontend redirects to success page
```

### Failure Flow
```
1. User redirected from bKash with ?status=failed
2. Frontend reads payment_id from localStorage
3. Frontend calls: POST /api/v1/public/membership-application/payment-failed
4. Backend records failure
5. Frontend redirects to payment retry page
```

## Testing the Flow

### 1. Check Backend Logs
When creating a payment, verify the backend is sending callback URLs to bKash:
```
Creating bKash payment with:
- callbackURL: http://localhost:3000/payment/bkash/callback?status=success
- cancelURL: http://localhost:3000/payment/bkash/callback?status=failed
```

### 2. Test in Sandbox
1. Submit membership form
2. Get redirected to bKash sandbox
3. Complete payment with test credentials
4. Verify you're redirected back to `/payment/bkash/callback?status=success`
5. Verify payment is confirmed and you reach success page

### 3. Test Cancellation
1. Submit membership form
2. Get redirected to bKash sandbox
3. Click "Cancel" on bKash page
4. Verify you're redirected back to `/payment/bkash/callback?status=failed`
5. Verify you reach the payment retry page

## Debugging

### If User Doesn't Return After Payment

**Check 1: Backend Logs**
- Is the backend sending callback URLs to bKash?
- Are the URLs correct and accessible?

**Check 2: bKash Dashboard**
- Check bKash merchant dashboard for payment status
- Verify callback URLs are configured

**Check 3: Browser Console**
- Check for any JavaScript errors
- Verify localStorage has payment_id and application_id

**Check 4: Network Tab**
- Check if bKash is trying to redirect
- Check for any CORS or network errors

### Common Issues

#### Issue 1: User Stuck on bKash Page
**Cause**: Backend didn't provide callback URLs to bKash
**Solution**: Add callbackURL and cancelURL when creating payment

#### Issue 2: Callback Page Shows "Payment information not found"
**Cause**: localStorage was cleared or payment_id not stored
**Solution**: Verify payment_id is stored before redirect

#### Issue 3: Payment Success but Application Still Pending
**Cause**: Backend payment confirmation endpoint not working
**Solution**: Check backend logs for payment-success endpoint

## Backend API Endpoints

### 1. Create Application with Payment
```
POST /api/v1/public/membership-application
```

**Request:**
```json
{
  "name_bangla": "...",
  "name_english": "...",
  ...
  "payment_method": "bkash"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "application": { "id": 21, ... },
    "payment": {
      "payment_id": 3,
      "bkashURL": "https://sandbox.payment.bkash.com/...",
      "paymentID": "TR0011..."
    }
  }
}
```

### 2. Confirm Payment Success
```
POST /api/v1/public/membership-application/payment-success
```

**Request:**
```json
{
  "payment_id": 3,
  "gateway_transaction_id": "TR0011..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

### 3. Report Payment Failure
```
POST /api/v1/public/membership-application/payment-failed
```

**Request:**
```json
{
  "payment_id": 3,
  "failure_reason": "Payment cancelled by user"
}
```

## URL Parameters from bKash

When bKash redirects back, it may include these parameters:

### Success Callback
```
/payment/bkash/callback?status=success&paymentID=TR0011...&trxID=ABC123
```

### Failure Callback
```
/payment/bkash/callback?status=failed&reason=User+cancelled
```

## Security Considerations

1. **Verify Payment on Backend**: Always verify payment status with bKash API on backend
2. **Don't Trust Frontend**: Frontend status is for UX only, backend must verify
3. **Use HTTPS**: Always use HTTPS in production for callback URLs
4. **Validate Payment ID**: Ensure payment_id matches the application
5. **Check Amount**: Verify payment amount matches expected amount

## Next Steps

1. ✅ Frontend is ready and configured
2. ⏳ Configure callback URLs on backend when creating bKash payment
3. ⏳ Test the complete flow in sandbox
4. ⏳ Verify payment confirmation works
5. ⏳ Test error scenarios

## Support

If you need help configuring the backend:
- Check bKash API documentation: https://developer.bka.sh/
- Review Laravel bKash package documentation
- Contact bKash merchant support

---

**Status**: Frontend is ready. Backend needs to configure callback URLs when creating payments.
