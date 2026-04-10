# Pension Payment Integration with bKash

## Overview

This document describes the complete pension installment payment flow using bKash payment gateway.

## Architecture

### Frontend Components

1. **Main Pension Page** - `app/(auth)/dashboard/pensions/page.tsx`
   - Displays all enrollments and installments
   - Shows payment alerts for overdue and current month due
   - Handles payment initiation

2. **Payment Modal** - `components/dashboard/pensions/PensionPaymentModal.tsx`
   - Allows user to select number of installments to pay
   - Shows payment preview and total amount
   - Initiates payment flow

3. **Payment Callback** - `app/(auth)/pension/payment-success/page.tsx`
   - Handles redirect from backend after bKash payment
   - Confirms payment with backend
   - Shows success UI with payment details
   - Displays enrollment information
   - Provides navigation options

### Backend Integration

4. **Payment Service** - `lib/services/pensionPayment.service.ts`
   - API calls to backend for payment operations
   - Handles payment initiation and confirmation

5. **Payment Hook** - `lib/hooks/user/usePensionPayment.ts`
   - React hook for managing payment state
   - Opens payment window and monitors status

## Payment Flow

### Step 1: User Initiates Payment

```
User clicks "Pay Now" on installment
  ↓
Payment Modal opens
  ↓
User selects number of installments (1-12+)
  ↓
User clicks "Pay with bKash"
```

### Step 2: Backend Creates Payment

```javascript
POST /api/v1/pension-enrollment/pay/{enrollment_id}
{
  "count": 3,
  "payment_method": "bkash"
}

Response:
{
  "success": true,
  "message": "Payment 123 initiated for 3 installment(s)...",
  "payment_id": 123,
  "bkashURL": "https://sandbox.payment.bkash.com/...",
  "paymentID": "TR0011..."
}
```

### Step 3: Redirect to bKash

```javascript
// Store payment ID for callback
localStorage.setItem('pending_pension_payment_id', '123');
localStorage.setItem('pending_pension_enrollment_id', '5');

// Open bKash in new window
window.open(bkashURL, 'bKash Payment', 'width=600,height=700');
```

### Step 4: bKash Payment

```
User completes payment on bKash
  ↓
bKash redirects to backend callback
  ↓
Backend verifies payment with bKash API
  ↓
Backend updates installments as paid
  ↓
Backend processes commission (30 TK per installment)
  ↓
Backend redirects to frontend callback
```

### Step 5: Frontend Callback

```
Backend redirects to:
/dashboard/pensions/payment-callback?paymentID=TR0011&status=success
  ↓
Frontend retrieves stored payment_id
  ↓
Frontend calls callback API to confirm
  ↓
Shows success message
  ↓
Redirects to /dashboard/pensions?payment=success
```

## API Endpoints

### 1. Initiate Payment

**Endpoint:** `POST /api/v1/pension-enrollment/pay/{enrollment_id}`

**Request:**
```json
{
  "count": 3,
  "payment_method": "bkash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment 123 initiated for 3 installment(s). Please proceed to payment gateway.",
  "payment_id": 123,
  "bkashURL": "https://sandbox.payment.bkash.com/...",
  "paymentID": "TR0011..."
}
```

### 2. Complete Payment

**Endpoint:** `POST /api/v1/pension-enrollment/pay/callback`

**Request:**
```json
{
  "payment_id": 123,
  "status": "success",
  "gateway_transaction_id": "TR0011..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment PAY-xxx has already been completed.",
  "status": "completed",
  "payment_id": "PAY-xxx"
}
```

## Backend Configuration

### Environment Variables

```env
# bKash Configuration
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_password
BKASH_BASE_URL=https://sandbox.payment.bkash.com

# Callback URLs
FRONTEND_URL=http://localhost:3000
PENSION_SUCCESS_URL=${FRONTEND_URL}/pension/payment-success
```

### Backend Redirect Logic

The backend should detect pension payments and redirect accordingly:

```php
// After processing bKash callback
if ($payment->payment_type === 'pension_installment') {
    $redirectUrl = config('app.frontend_url') . '/pension/payment-success';
    $redirectUrl .= '?enrollment_id=' . $enrollmentId;
    $redirectUrl .= '&payment_id=' . $payment->id;
    $redirectUrl .= '&paymentID=' . $bkashPaymentID;
    $redirectUrl .= '&status=' . ($success ? 'success' : 'failed');
    
    return redirect($redirectUrl);
}
```

## Frontend Implementation

### Payment Modal Usage

```tsx
import PensionPaymentModal from '@/components/dashboard/pensions/PensionPaymentModal';
import { usePensionPayment } from '@/lib/hooks/user/usePensionPayment';

function PensionPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  
  const { initiatePayment, loading } = usePensionPayment({
    onSuccess: () => {
      setShowModal(false);
      refetchData();
    }
  });

  const handlePayNow = (installment) => {
    const enrollment = getEnrollment(installment.pension_enrollment_id);
    setSelectedEnrollment(enrollment);
    setShowModal(true);
  };

  const handlePaymentInitiate = async (enrollmentId, count) => {
    await initiatePayment(enrollmentId, count);
  };

  return (
    <>
      {/* Your pension UI */}
      
      <PensionPaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        enrollment={selectedEnrollment}
        unpaidInstallments={getUnpaidInstallments(selectedEnrollment)}
        onPaymentInitiate={handlePaymentInitiate}
        isLoading={loading}
      />
    </>
  );
}
```

## Features

### 1. Payment Alerts

- **Overdue Payments**: Red alert for past due installments
- **Current Month Due**: Amber alert for current month installments
- **Quick Pay**: Direct "Pay Now" buttons in alerts

### 2. Flexible Payment

- Pay 1 to 12+ installments at once
- Visual selector for quick selection
- Manual input for larger quantities
- Real-time total calculation

### 3. Payment Preview

- Shows all installments to be paid
- Displays due dates and amounts
- Highlights late fees if applicable
- Clear payment summary

### 4. Status Tracking

- Real-time payment status updates
- Success/failure notifications
- Automatic data refresh after payment
- Payment history in installment table

## Testing

### Test Scenarios

1. **Single Installment Payment**
```bash
# Pay 1 installment
Click "Pay Now" → Select 1 → Pay with bKash
```

2. **Multiple Installments**
```bash
# Pay 3 installments
Click "Pay Now" → Select 3 → Pay with bKash
```

3. **Overdue Payment**
```bash
# Pay overdue installment with late fee
Click "Pay Now" on red alert → Confirm payment
```

4. **Payment Cancellation**
```bash
# Cancel payment
Open payment modal → Close window → Verify cancellation
```

### bKash Sandbox Credentials

```
Phone: 01770618567
PIN: 1234
OTP: 123456
```

## Error Handling

### Common Errors

1. **Exceeds Remaining Installments**
```json
{
  "success": false,
  "message": "Requested 5 installments exceed remaining 3 installments."
}
```

2. **Payment Already Processed**
```json
{
  "success": true,
  "message": "Payment PAY-xxx has already been completed.",
  "status": "completed"
}
```

3. **Payment Window Blocked**
```
Error: "Please allow popups for payment"
Solution: Enable popups in browser settings
```

## Security Considerations

1. **Authentication**: All endpoints require Bearer token
2. **Authorization**: Users can only pay their own enrollments
3. **Idempotency**: Callback can be called multiple times safely
4. **Validation**: Backend validates installment count and amounts
5. **Transaction IDs**: Stored for audit trail

## Commission Processing

After successful payment:
- 30 TK commission per installment
- Credited to sponsor's account
- Processed asynchronously
- Tracked in commission_processed field

## Database Updates

### Installments Table

```sql
UPDATE pension_installments SET
  status = 'paid',
  paid_date = NOW(),
  amount_paid = total_amount,
  payment_reference = 'PAY-xxx',
  commission_processed = true,
  commission_processed_at = NOW()
WHERE id IN (1, 2, 3);
```

### Enrollment Table

```sql
UPDATE pension_enrollments SET
  installments_paid = installments_paid + 3,
  installments_remaining = installments_remaining - 3,
  total_amount_paid = total_amount_paid + 3000,
  last_payment_date = NOW(),
  next_due_date = '2026-07-10'
WHERE id = 5;
```

## Monitoring

### Key Metrics

- Payment success rate
- Average installments per payment
- Payment completion time
- Failed payment reasons
- Commission processing status

### Logs

```
[2026-04-10 10:00:00] Payment initiated: ID=123, Enrollment=5, Count=3
[2026-04-10 10:02:15] bKash redirect: PaymentID=TR0011...
[2026-04-10 10:05:30] Payment completed: ID=123, Status=success
[2026-04-10 10:05:31] Commission processed: 90 TK to sponsor
```

## Troubleshooting

### Payment Not Completing

1. Check localStorage for pending_pension_payment_id
2. Verify backend callback URL is correct
3. Check bKash sandbox status
4. Review Laravel logs for errors

### Callback Not Working

1. Verify FRONTEND_URL in backend .env
2. Check CORS settings
3. Ensure callback route exists
4. Test with direct URL access

### Commission Not Processing

1. Check commission_processed field
2. Review commission rules
3. Verify sponsor relationship
4. Check commission queue jobs

## Future Enhancements

1. **Payment Methods**: Add Nagad, Rocket, SSLCommerz
2. **Partial Payments**: Allow partial installment payments
3. **Auto-pay**: Schedule automatic payments
4. **Payment Plans**: Custom payment schedules
5. **Receipts**: Generate PDF receipts
6. **Notifications**: SMS/Email payment reminders

## Support

For issues or questions:
- Check `MEMBER_PENSION_INSTALLMENT_APIS.md` for API details
- Review Laravel logs: `storage/logs/laravel.log`
- Test with bKash sandbox
- Contact system administrator

---

**Last Updated:** April 10, 2026  
**Version:** 1.0  
**Status:** Production Ready
