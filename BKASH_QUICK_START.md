# bKash Payment - Quick Start Guide 🚀

## What Was Implemented?

bKash payment integration has been added to your Next.js application, specifically integrated into the membership registration flow.

## File Structure

```
your-project/
├── lib/
│   ├── services/
│   │   └── bkash.service.ts          ← API calls to backend
│   └── hooks/
│       └── useBkashPayment.ts        ← Payment logic & polling
├── components/
│   └── payment/
│       ├── BkashPayment.tsx          ← Payment form UI
│       └── PaymentMethodSelector.tsx ← Method chooser
├── app/
│   ├── payment/bkash/callback/
│   │   └── page.tsx                  ← Callback handler
│   └── (public)/membership/
│       └── success/page.tsx          ← Success page
└── components/public/membership/
    └── ReviewStep.tsx                ← Modified (payment modal)
```

## How It Works

### User Journey
1. User fills membership registration form
2. User reviews application on final step
3. User clicks "Proceed to Payment"
4. Application submitted to backend
5. **Payment modal opens automatically** ✨
6. User selects bKash and clicks "Pay Now"
7. bKash payment window opens
8. User completes payment in bKash
9. System detects payment completion
10. User redirected to success page

### Technical Flow
```
ReviewStep → Submit Form → Backend Creates Application → 
Payment Modal Opens → bKash Window → Poll Status → 
Execute Payment → Success Page
```

## Quick Test (Frontend Only)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to membership page:**
   ```
   http://localhost:3000/membership
   ```

3. **Fill the registration form:**
   - Complete all steps
   - Reach the Review step
   - Click "Proceed to Payment"

4. **Payment modal should open** (will fail without backend)

## Backend Integration

Your Laravel backend needs these endpoints:

### 1. Create Payment
```
POST /api/v1/bkash/create-payment
```

**Request:**
```json
{
  "amount": 1400,
  "payment_type": "membership_joining",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "01712345678",
  "user_id": 123,
  "reference_id": "123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 1,
    "bkashURL": "https://sandbox.payment.bkash.com/...",
    "paymentID": "TR0011abc123",
    "invoice_number": "INV-2024-001"
  }
}
```

### 2. Execute Payment
```
POST /api/v1/bkash/execute-payment
```

**Request:**
```json
{
  "paymentID": "TR0011abc123",
  "status": "success"
}
```

### 3. Query Payment
```
POST /api/v1/bkash/query-payment
```

**Request:**
```json
{
  "paymentID": "TR0011abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionStatus": "Completed"
  }
}
```

## Environment Setup

Add to `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Using in Other Pages

### Example: Monthly Payment
```tsx
'use client';

import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import { useState } from 'react';

export default function MonthlyPaymentPage() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPayment(true)}>
        Pay Monthly Fee
      </button>

      {showPayment && (
        <PaymentMethodSelector
          amount={500}
          paymentType="monthly_payment"
          userId={123}
          customerInfo={{
            name: 'John Doe',
            email: 'john@example.com',
            phone: '01712345678'
          }}
          hideCustomerForm={true}
          onSuccess={(payment) => {
            console.log('Payment successful:', payment);
            setShowPayment(false);
            // Refresh data, show success message, etc.
          }}
          onError={(error) => {
            console.error('Payment failed:', error);
          }}
        />
      )}
    </div>
  );
}
```

### Example: Donation
```tsx
<PaymentMethodSelector
  amount={donationAmount}
  paymentType="donation"
  onSuccess={(payment) => {
    alert('Thank you for your donation!');
  }}
/>
```

## Key Features

### ✅ Auto-Polling
- Checks payment status every 3 seconds
- Timeout after 5 minutes
- Auto-closes payment window

### ✅ Pre-filled Data
- Customer info from registration form
- No need to re-enter details

### ✅ Error Handling
- Network errors
- Payment cancellation
- Timeout scenarios

### ✅ User Experience
- Loading states
- Toast notifications
- Cancel button
- Clear error messages

## Payment Types Supported

- `membership_joining` - Initial membership fee
- `monthly_payment` - Monthly pension contributions
- `donation` - One-time donations
- `project_funding` - Project contributions
- Custom types (add as needed)

## Testing with bKash Sandbox

### Test Credentials
- **Phone Numbers**: 01770618567, 01770618568, 01770618569
- **OTP**: 123456
- **PIN**: Any 4 digits

### Test Scenarios
1. ✅ Successful payment
2. ❌ Cancel payment
3. ❌ Close window (timeout)
4. ❌ Network error

## Common Issues

### Payment window doesn't open
- Check browser popup blocker
- Verify `NEXT_PUBLIC_API_BASE_URL` is set
- Check browser console for errors

### Payment status not updating
- Verify backend `/query-payment` endpoint works
- Check network tab for polling requests
- Ensure paymentID is correct

### Modal doesn't show
- Check if application submission succeeded
- Verify `setShowPaymentModal(true)` is called
- Check for JavaScript errors

## Next Steps

1. **Set up backend endpoints** (see above)
2. **Test in sandbox mode**
3. **Add to other pages** (monthly payment, donations)
4. **Configure production credentials**
5. **Deploy and test**

## Need Help?

- **Full Guide**: See `BKASH_INTEGRATION_GUIDE.md`
- **Checklist**: See `BKASH_IMPLEMENTATION_CHECKLIST.md`
- **Original Spec**: See `NEXTJS_BKASH_IMPLEMENTATION.md`

## Summary

✅ bKash payment is fully integrated into membership registration  
✅ Payment modal opens automatically after form submission  
✅ Customer info pre-filled from registration form  
✅ Ready to use in other pages (monthly payment, donations, etc.)  
✅ All TypeScript types defined  
✅ Error handling implemented  
✅ No compilation errors  

**Status: Ready for backend integration and testing! 🎉**
