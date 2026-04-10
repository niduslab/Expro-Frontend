# Pension Payment Success Page

## Overview

The `/pension/payment-success` page is the dedicated success page for pension installment payments. After the backend processes the bKash payment, it redirects to this page with payment details.

## Route

```
/pension/payment-success
```

**Full Path:** `app/(auth)/pension/payment-success/page.tsx`

## URL Parameters

The backend redirects with these query parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enrollment_id` | number | Yes | The pension enrollment ID |
| `payment_id` | number | Yes | The payment record ID |
| `paymentID` | string | Optional | bKash transaction ID |
| `trxID` | string | Optional | Alternative transaction ID |
| `status` | string | Yes | Payment status: `success`, `failed`, or `cancelled` |

### Example URLs

**Success:**
```
/pension/payment-success?enrollment_id=40&payment_id=242&paymentID=TR0011a2gQVNA1775802801215&status=success
```

**Failed:**
```
/pension/payment-success?enrollment_id=40&payment_id=242&status=failed&reason=Insufficient+balance
```

**Cancelled:**
```
/pension/payment-success?enrollment_id=40&payment_id=242&status=cancelled
```

## Backend Redirect Configuration

### Required Changes

The backend must redirect pension payments to this new route:

```php
// In your bKash callback handler
if ($payment->payment_type === 'pension_installment') {
    // Get enrollment ID from payment metadata
    $metadata = json_decode($payment->metadata, true);
    $enrollmentId = $metadata['enrollment_id'] ?? null;
    
    // Build redirect URL
    $redirectUrl = config('app.frontend_url') . '/pension/payment-success';
    $redirectUrl .= '?enrollment_id=' . $enrollmentId;
    $redirectUrl .= '&payment_id=' . $payment->id;
    $redirectUrl .= '&paymentID=' . $bkashPaymentID;
    $redirectUrl .= '&status=' . ($success ? 'success' : 'failed');
    
    return redirect($redirectUrl);
}
```

### Environment Variable

Add to `.env`:

```env
FRONTEND_URL=http://localhost:3000
PENSION_SUCCESS_URL=${FRONTEND_URL}/pension/payment-success
```

## Page Features

### 1. Processing State

Shows while confirming payment with backend:

```
┌─────────────────────────────────────┐
│         ⏳ (spinning)                │
│                                     │
│     Processing Payment              │
│                                     │
│  Please wait while we confirm...   │
│                                     │
│         • • • (bouncing)            │
└─────────────────────────────────────┘
```

### 2. Success State

Shows after successful payment confirmation:

```
┌─────────────────────────────────────────────────────┐
│  [Gradient Header: Emerald to Teal]                 │
│                                                     │
│         ✅ (in white circle)                        │
│                                                     │
│       Payment Successful!                           │
│  Your pension installment payment has been completed│
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📦 Enrollment Details                              │
│  ┌───────────────────────────────────────────────┐ │
│  │ Enrollment Number: EN-2024-001                │ │
│  │ Status: Active                                │ │
│  │ Installments Paid: 15 / 100                   │ │
│  │ Total Paid: ৳15,000                           │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  📄 Payment Information                             │
│  ┌───────────────────────────────────────────────┐ │
│  │ Payment ID: #242                              │ │
│  │ Enrollment ID: #40                            │ │
│  │ Payment Method: bKash                         │ │
│  │ Payment Date: Apr 10, 2026 10:05 AM          │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ✅ What happens next?                              │
│  • Your installments have been marked as paid      │
│  • Commission processing has been initiated        │
│  • Your enrollment progress has been updated       │
│  • Payment receipt is available in history         │
│                                                     │
│  [View Pension Details →]  [Go to Dashboard]       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Error State

Shows if payment confirmation fails:

```
┌─────────────────────────────────────┐
│         ❌ (in red circle)           │
│                                     │
│  Payment Confirmation Issue         │
│                                     │
│  We're having trouble confirming... │
│  Please check your pension details  │
│                                     │
│  [Check Pension Status]             │
│  [Go to Dashboard]                  │
└─────────────────────────────────────┘
```

## Page Flow

```
1. Backend redirects to /pension/payment-success
   ↓
2. Page loads with URL parameters
   ↓
3. Shows "Processing Payment" state
   ↓
4. Retrieves payment_id from URL or localStorage
   ↓
5. Calls backend confirmation API:
   POST /api/v1/pension-enrollment/pay/callback
   ↓
6. Fetches updated enrollment data
   ↓
7. Shows success state with details
   ↓
8. User clicks "View Pension Details"
   ↓
9. Redirects to /dashboard/pensions
```

## API Calls

### 1. Payment Confirmation

```typescript
POST /api/v1/pension-enrollment/pay/callback

Request:
{
  payment_id: 242,
  status: "success",
  gateway_transaction_id: "TR0011a2gQVNA1775802801215"
}

Response:
{
  success: true,
  message: "Payment completed successfully",
  status: "completed",
  payment_id: "PAY-242"
}
```

### 2. Enrollment Data Fetch

```typescript
GET /api/v1/mypensionenrollments

Response:
{
  success: true,
  data: [
    {
      id: 40,
      enrollment_number: "EN-2024-001",
      installments_paid: 15,
      total_amount_paid: "15000.00",
      // ... other fields
    }
  ]
}
```

## Component Structure

```typescript
export default function PensionPaymentSuccessPage() {
  // State
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completePayment } = usePensionPayment();
  const { data: enrollmentsRes, refetch } = useMyPensionEnrollments();

  // Extract URL params
  const enrollmentId = searchParams.get("enrollment_id");
  const paymentId = searchParams.get("payment_id");

  // Process payment on mount
  useEffect(() => {
    processPayment();
  }, []);

  // Render based on status
  return (
    <div>
      {status === "processing" && <ProcessingState />}
      {status === "success" && <SuccessState />}
      {status === "error" && <ErrorState />}
    </div>
  );
}
```

## Styling

### Colors

- **Success Gradient**: `from-emerald-500 to-teal-500`
- **Background**: `from-emerald-50 via-teal-50 to-cyan-50`
- **Info Cards**: `from-emerald-50 to-teal-50`
- **Text**: 14px base font size

### Components

- **Success Icon**: White circle with emerald checkmark
- **Cards**: Rounded-xl with shadows
- **Buttons**: Primary (emerald) and secondary (gray)
- **Gradients**: Smooth emerald to teal transitions

## LocalStorage Management

```typescript
// Before redirect (in payment initiation)
localStorage.setItem('pending_pension_payment_id', '242');
localStorage.setItem('pending_pension_enrollment_id', '40');

// On success page (fallback if URL param missing)
const paymentId = searchParams.get('payment_id') || 
                  localStorage.getItem('pending_pension_payment_id');

// After successful confirmation
localStorage.removeItem('pending_pension_payment_id');
localStorage.removeItem('pending_pension_enrollment_id');
```

## Navigation Options

### Primary Action
```typescript
<button onClick={() => router.push('/dashboard/pensions')}>
  View Pension Details →
</button>
```

### Secondary Action
```typescript
<button onClick={() => router.push('/dashboard')}>
  Go to Dashboard
</button>
```

## Error Handling

### Missing Payment ID
```typescript
if (!paymentId) {
  console.error("No payment ID found");
  setStatus("error");
  return;
}
```

### API Error
```typescript
try {
  await completePayment(paymentId, transactionId);
} catch (error) {
  console.error("Payment confirmation error:", error);
  setStatus("error");
}
```

### Network Error
```typescript
// Show error state
// User can retry by clicking "Check Pension Status"
// Payment may still be processed successfully
```

## Responsive Design

### Mobile (< 768px)
- Full-width layout
- Stacked buttons
- Simplified card layout
- Touch-friendly spacing

### Desktop (> 768px)
- Max-width container (2xl)
- Side-by-side buttons
- Detailed card layout
- Hover effects

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Loading announcements
- ✅ Error messages
- ✅ Color contrast (WCAG AA)

## Testing

### Test Scenarios

1. **Successful Payment**
```
URL: /pension/payment-success?enrollment_id=40&payment_id=242&paymentID=TR0011...&status=success
Expected: Shows success state with enrollment details
```

2. **Failed Payment**
```
URL: /pension/payment-success?enrollment_id=40&payment_id=242&status=failed
Expected: Shows error state with retry options
```

3. **Missing Parameters**
```
URL: /pension/payment-success
Expected: Falls back to localStorage, shows error if not found
```

4. **API Error**
```
Scenario: Backend confirmation API fails
Expected: Shows error state, suggests checking status
```

## Migration from Old Callback

### Old Route (Deprecated)
```
/dashboard/pensions/payment-callback
```

### New Route (Current)
```
/pension/payment-success
```

### Why Changed?

1. **Better UX**: Dedicated success page with full details
2. **More Info**: Shows enrollment data and payment info
3. **Cleaner URL**: Shorter, more semantic path
4. **Consistent**: Matches membership payment pattern

### Backward Compatibility

The old callback route is kept for compatibility but should not be used for new implementations.

## Summary

✅ **Created**: `/pension/payment-success` page  
✅ **Features**: Processing, success, and error states  
✅ **Displays**: Enrollment details and payment info  
✅ **Navigation**: View pensions or go to dashboard  
✅ **Responsive**: Works on all devices  
✅ **Accessible**: WCAG AA compliant  

---

**Page Version:** 1.0  
**Last Updated:** April 10, 2026  
**Status:** Production Ready 🚀
