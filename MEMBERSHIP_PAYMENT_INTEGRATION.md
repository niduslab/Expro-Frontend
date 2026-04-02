# Membership Application Payment Integration - Implementation Guide

## Overview

The membership registration now integrates with the backend payment system. Payment is initiated automatically when the user submits their membership application.

## How It Works

### Flow Diagram
```
User Fills Form → Review Step → Submit Application → 
Backend Creates Application (payment_pending) → 
Backend Initiates Payment → Returns bKash URL → 
Frontend Opens Payment Window → User Completes Payment → 
Payment Callback → Backend Updates Status (submitted) → 
Success Page
```

## Implementation Details

### 1. Application Submission with Payment

When user clicks "Proceed to Payment" in ReviewStep:

**Request to Backend:**
```json
POST /api/v1/public/membership-application

{
  "name_english": "John Doe",
  "name_bangla": "জন ডো",
  "father_husband_name": "Father Name",
  "mother_name": "Mother Name",
  "date_of_birth": "1990-01-01",
  "nid_number": "1234567890",
  "academic_qualification": "bachelor",
  "permanent_address": "Permanent Address",
  "present_address": "Present Address",
  "religion": "Islam",
  "gender": "male",
  "mobile": "01712345678",
  "email": "john@example.com",
  "photo": "base64_or_file",
  "membership_type": "general",
  "sponsor_id": 1,
  "pension_package_id": 1,
  "nominees": [
    {
      "name": "Nominee Name",
      "relation": "Brother",
      "dob": "1995-01-01"
    }
  ],
  "payment_method": "bkash"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Membership application created. Please complete payment to submit.",
  "data": {
    "application": {
      "id": 123,
      "application_number": "APP-ABC123XYZ",
      "name_english": "John Doe",
      "status": "payment_pending"
    },
    "payment": {
      "payment_id": 456,
      "payment_method": "bkash",
      "bkashURL": "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create/...",
      "paymentID": "TR0011abc123",
      "amount": 1400,
      "currency": "BDT"
    }
  }
}
```

### 2. Frontend Handling

**File: `components/public/membership/ReviewStep.tsx`**

```typescript
// On successful application submission
mutate(mappedPayload, {
  onSuccess: (res) => {
    if (res.data?.payment) {
      const paymentData = res.data.payment;
      
      // Store IDs for callback handling
      localStorage.setItem('application_id', res.data.application?.id?.toString());
      localStorage.setItem('payment_id', paymentData.payment_id?.toString());
      
      // Open bKash payment window
      if (paymentData.payment_method === 'bkash' && paymentData.bkashURL) {
        window.open(
          paymentData.bkashURL,
          'bKash Payment',
          'width=600,height=700,scrollbars=yes'
        );
        
        // Show instructions modal
        setShowPaymentModal(true);
      }
    }
  }
});
```

### 3. Payment Callback Handling

**File: `app/payment/bkash/callback/page.tsx`**

When user completes payment in bKash, they are redirected to:
```
/payment/bkash/callback?status=success&transactionId=TR123456
```

The callback page:
1. Retrieves `payment_id` from localStorage
2. Calls backend to confirm payment success
3. Redirects to success page

**Backend Call:**
```typescript
POST /api/v1/public/membership-application/payment-success

{
  "payment_id": 456,
  "gateway_transaction_id": "TR123456"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Payment completed successfully. Your application has been submitted.",
  "data": {
    "application": {
      "id": 123,
      "application_number": "APP-ABC123XYZ",
      "status": "submitted"
    },
    "payment_status": "completed"
  }
}
```

### 4. Payment Failure Handling

If payment fails or is cancelled:
```
/payment/bkash/callback?status=failed&reason=User+cancelled
```

**Backend Call:**
```typescript
POST /api/v1/public/membership-application/payment-failed

{
  "payment_id": 456,
  "failure_reason": "User cancelled payment"
}
```

User is redirected to retry page: `/membership/payment-retry?application_id=123`

### 5. Payment Retry

**File: `app/(public)/membership/payment-retry/page.tsx`**

Allows users to retry payment for an existing application.

**Backend Call:**
```typescript
POST /api/v1/public/membership-application/123/retry-payment

{
  "payment_method": "bkash"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Payment initiated. Please complete payment.",
  "data": {
    "payment_id": 789,
    "payment_method": "bkash",
    "bkashURL": "https://checkout.sandbox.bka.sh/...",
    "amount": 1400,
    "currency": "BDT"
  }
}
```

## Files Structure

```
├── lib/
│   ├── services/
│   │   └── bkash.service.ts          # API calls for payment callbacks
│   └── hooks/
│       └── useBkashPayment.ts        # Payment management hook
├── components/
│   ├── payment/
│   │   ├── BkashPayment.tsx          # (Optional - for standalone use)
│   │   └── PaymentMethodSelector.tsx # (Optional - for standalone use)
│   └── public/membership/
│       └── ReviewStep.tsx            # Modified - handles payment flow
├── app/
│   ├── payment/bkash/callback/
│   │   └── page.tsx                  # Payment callback handler
│   └── (public)/membership/
│       ├── success/page.tsx          # Success page
│       └── payment-retry/page.tsx    # Payment retry page
```

## Key Features

### ✅ Automatic Payment Initiation
- Payment is initiated when application is submitted
- No separate payment step needed
- Backend handles payment gateway integration

### ✅ Payment Window Management
- Opens bKash in popup window
- Shows instructions modal
- Handles window close events

### ✅ Callback Handling
- Processes success/failure callbacks
- Updates application status
- Clears localStorage after completion

### ✅ Payment Retry
- Dedicated retry page
- Supports multiple payment methods
- Maintains application data

### ✅ Error Handling
- Network errors
- Payment cancellation
- Invalid payment data
- Timeout scenarios

## Application Status Flow

1. **payment_pending** - Application created, waiting for payment
2. **submitted** - Payment completed, application submitted for review
3. **under_review** - Admin is reviewing the application
4. **approved** - Application approved
5. **rejected** - Application rejected

## Testing

### Test Flow
1. Fill membership registration form
2. Click "Proceed to Payment"
3. Application submitted with `payment_pending` status
4. bKash window opens
5. Complete payment in sandbox
6. Redirected to callback page
7. Payment confirmed with backend
8. Redirected to success page

### Test Credentials (Sandbox)
- **Phone Numbers**: 01770618567, 01770618568, 01770618569
- **OTP**: 123456
- **PIN**: Any 4 digits

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Backend Requirements

Your Laravel backend must have these endpoints:

1. `POST /api/v1/public/membership-application`
   - Creates application with payment_pending status
   - Initiates payment with bKash
   - Returns bkashURL

2. `POST /api/v1/public/membership-application/payment-success`
   - Confirms payment completion
   - Updates application status to submitted

3. `POST /api/v1/public/membership-application/payment-failed`
   - Records payment failure
   - Keeps application in payment_pending status

4. `POST /api/v1/public/membership-application/{id}/retry-payment`
   - Initiates new payment for existing application
   - Returns new bkashURL

## Common Issues & Solutions

### Issue: Payment window doesn't open
**Solution:** Check browser popup blocker settings

### Issue: Callback not working
**Solution:** Verify callback URL is configured in bKash merchant panel

### Issue: Payment ID not found
**Solution:** Ensure localStorage is not cleared before callback

### Issue: Application status not updating
**Solution:** Check backend payment-success endpoint is working

## Security Considerations

1. **Payment ID Validation**: Backend validates payment_id belongs to application
2. **Transaction Verification**: Backend verifies transaction with bKash before updating status
3. **HTTPS Required**: Use HTTPS in production
4. **CSRF Protection**: Implement CSRF tokens for callbacks
5. **Rate Limiting**: Implement on backend to prevent abuse

## Next Steps

1. ✅ Test in sandbox environment
2. ✅ Verify all payment flows
3. ✅ Test error scenarios
4. ⏳ Configure production bKash credentials
5. ⏳ Set up payment monitoring
6. ⏳ Configure email notifications
7. ⏳ Deploy to production

## Support

For issues or questions:
- **Email**: support@exprowelfare.org
- **Documentation**: See backend API documentation
- **bKash Docs**: https://developer.bka.sh/

## Summary

✅ Payment integrated with membership registration  
✅ Automatic payment initiation on form submission  
✅ Payment callback handling implemented  
✅ Payment retry functionality added  
✅ Success and failure flows handled  
✅ Ready for testing with backend API  

**Status: Ready for Integration Testing! 🎉**
