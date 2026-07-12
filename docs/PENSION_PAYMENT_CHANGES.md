# Pension Payment - Changes Made

## Issue
After clicking "Pay Now", the backend response format was:
```json
{
  "success": true,
  "message": "Payment initiated for 2 installment(s)...",
  "data": {
    "payment_id": 240,
    "payment_method": "bkash",
    "bkashURL": "https://sandbox.payment.bkash.com/...",
    "paymentID": "TR0011...",
    "amount": "1000.00",
    "currency": "BDT"
  }
}
```

The payment data was nested in a `data` object, but the code was expecting it at the root level.

## Solution
Updated the pension payment flow to match the membership payment implementation:
1. Use direct `window.location.href` redirect (not popup)
2. Handle nested `data` object in response
3. Store payment ID before redirect
4. Backend redirects to frontend callback after processing

## Files Changed

### 1. `lib/services/pensionPayment.service.ts`

**Before:**
```typescript
export interface PensionPaymentResponse {
  success: boolean;
  message: string;
  payment_id: number;
  bkashURL?: string;
  paymentID?: string;
  gateway_url?: string;
}
```

**After:**
```typescript
export interface PensionPaymentData {
  payment_id: number;
  payment_method: string;
  bkashURL?: string;
  paymentID?: string;
  amount: string;
  currency: string;
  gateway_url?: string;
}

export interface PensionPaymentResponse {
  success: boolean;
  message: string;
  data?: PensionPaymentData;
}
```

### 2. `lib/hooks/user/usePensionPayment.ts`

**Key Changes:**

1. **Removed popup window approach:**
```typescript
// REMOVED
const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
const newWindow = window.open(bkashURL, 'bKash Payment', 'width=600,height=700');
```

2. **Added direct redirect (like membership):**
```typescript
// ADDED
if (response.success && response.data) {
  const paymentData = response.data;
  
  // Store payment ID
  localStorage.setItem('pending_pension_payment_id', paymentData.payment_id.toString());
  
  // Direct redirect to bKash
  if (paymentData.payment_method === 'bkash' && paymentData.bkashURL) {
    window.location.href = paymentData.bkashURL;
  }
}
```

3. **Updated response handling:**
```typescript
// Access nested data object
const paymentData = response.data;

// Use paymentData.payment_id instead of response.payment_id
localStorage.setItem('pending_pension_payment_id', paymentData.payment_id.toString());
```

4. **Simplified cancelPayment:**
```typescript
// BEFORE: Closed popup window
const cancelPayment = useCallback(() => {
  if (paymentWindow && !paymentWindow.closed) {
    paymentWindow.close();
    // ...
  }
}, [paymentWindow, reportPaymentFailure]);

// AFTER: Just reports failure
const cancelPayment = useCallback(() => {
  const paymentId = localStorage.getItem('pending_pension_payment_id');
  if (paymentId) {
    reportPaymentFailure(parseInt(paymentId));
  }
  setLoading(false);
}, [reportPaymentFailure]);
```

## Flow Comparison

### Before (Popup Approach)
```
1. User clicks "Pay Now"
2. Modal opens
3. User selects count
4. API call returns payment data
5. Open bKash in POPUP window
6. Monitor popup for close
7. User completes payment
8. bKash redirects to backend
9. Backend processes
10. Backend redirects to frontend callback
11. Callback page confirms payment
```

### After (Direct Redirect - Like Membership)
```
1. User clicks "Pay Now"
2. Modal opens
3. User selects count
4. API call returns payment data
5. Store payment ID in localStorage
6. DIRECT REDIRECT to bKash (window.location.href)
7. User completes payment
8. bKash redirects to backend
9. Backend processes
10. Backend redirects to frontend callback
11. Callback page confirms payment
```

## Benefits of Direct Redirect

1. **No Popup Blockers**: Avoids browser popup blocking issues
2. **Better Mobile Experience**: Works better on mobile devices
3. **Consistent with Membership**: Same flow as membership payment
4. **Simpler Code**: No need to monitor popup window
5. **More Reliable**: Less chance of window communication issues

## Backend Requirements

The backend must redirect pension payments to:
```
${FRONTEND_URL}/dashboard/pensions/payment-callback?paymentID=xxx&status=success
```

**Detection Logic:**
```php
if ($payment->payment_type === 'pension_installment') {
    $redirectUrl = config('app.frontend_url') . '/dashboard/pensions/payment-callback';
    $redirectUrl .= '?paymentID=' . $bkashPaymentID;
    $redirectUrl .= '&status=' . ($success ? 'success' : 'failed');
    
    return redirect($redirectUrl);
}
```

## Testing

### Test with Backend Response
```json
{
  "success": true,
  "message": "Payment initiated for 2 installment(s). Please complete payment.",
  "data": {
    "payment_id": 240,
    "payment_method": "bkash",
    "bkashURL": "https://sandbox.payment.bkash.com/?paymentId=TR0011...",
    "paymentID": "TR0011a2gQVNA1775802801215",
    "amount": "1000.00",
    "currency": "BDT"
  }
}
```

### Expected Behavior
1. ✅ Payment ID stored in localStorage
2. ✅ User redirected to bKash URL
3. ✅ After payment, redirected to callback page
4. ✅ Callback page confirms payment
5. ✅ Success message shown
6. ✅ Redirected back to pensions page
7. ✅ Data refreshed automatically

## Console Logs

The code now includes helpful console logs:

```typescript
console.log("✅ Payment Response:", response);
console.log("📦 Payment Data:", response.data);
console.log("🔗 Redirecting to payment URL:", paymentData.bkashURL);
```

These help debug the payment flow.

## Error Handling

```typescript
if (response.success && response.data) {
  // Process payment
} else {
  toast.error(response.message || 'Failed to initiate payment');
  setLoading(false);
}
```

If no payment URL:
```typescript
if (!paymentData.bkashURL) {
  console.error("❌ No payment URL found in response");
  toast.error('Payment URL not found. Please contact support.');
  setLoading(false);
}
```

## Documentation Added

1. **`BACKEND_PENSION_PAYMENT_CONFIG.md`**
   - Complete backend configuration guide
   - Response format requirements
   - Redirect logic
   - Database updates
   - Commission processing
   - Example implementation

## Summary

✅ **Fixed**: Payment response handling to match backend format  
✅ **Changed**: From popup to direct redirect (like membership)  
✅ **Added**: Proper error handling and logging  
✅ **Documented**: Backend configuration requirements  
✅ **Tested**: No TypeScript errors  

The pension payment now works exactly like the membership payment, ensuring consistency across the application.

---

**Status:** ✅ Ready for Testing  
**Date:** April 10, 2026  
**Version:** 1.1
