# bKash Payment Integration Guide

## Overview
This guide explains how the bKash payment system has been integrated into the membership registration flow.

## Files Created

### 1. Service Layer
- **`lib/services/bkash.service.ts`** - Handles all API calls to the backend for bKash payments
  - `createPayment()` - Initiates a payment
  - `executePayment()` - Completes a payment after user approval
  - `queryPayment()` - Checks payment status
  - `searchTransaction()` - Searches for a transaction by ID

### 2. Custom Hook
- **`lib/hooks/useBkashPayment.ts`** - React hook for managing payment flow
  - Opens bKash payment window
  - Polls for payment status every 3 seconds
  - Handles success/failure/timeout scenarios
  - Auto-closes payment window on completion

### 3. Payment Components
- **`components/payment/BkashPayment.tsx`** - Main bKash payment form
  - Collects customer information (name, email, phone)
  - Displays amount and payment type
  - Handles payment initiation
  - Shows loading states

- **`components/payment/PaymentMethodSelector.tsx`** - Payment method chooser
  - Allows switching between bKash and SSLCommerz
  - Passes customer info to payment components
  - Can hide customer form if info already collected

### 4. Callback Handler
- **`app/payment/bkash/callback/page.tsx`** - Handles payment gateway redirects
  - Processes payment results
  - Shows success/failure UI
  - Redirects to appropriate pages

### 5. Success Page
- **`app/(public)/membership/success/page.tsx`** - Post-payment success page
  - Displays confirmation message
  - Shows next steps
  - Clears form data from localStorage

## Integration in Membership Registration

### Modified Files
- **`components/public/membership/ReviewStep.tsx`**
  - Added payment modal after successful application submission
  - Integrated `PaymentMethodSelector` component
  - Pre-fills customer info from registration form
  - Handles payment success/failure callbacks

## How It Works

### 1. User Flow
```
Registration Form → Review Step → Submit Application → Payment Modal → bKash Gateway → Success Page
```

### 2. Payment Process
1. User completes membership registration form
2. User reviews and submits application
3. Backend creates membership application record
4. Payment modal opens automatically
5. User selects bKash payment method
6. User clicks "Pay Now"
7. bKash payment window opens
8. User completes payment in bKash
9. System polls for payment status
10. On success, payment window closes
11. User redirected to success page

### 3. Technical Flow
```typescript
// 1. Create payment
const response = await bkashService.createPayment({
  amount: 1400,
  payment_type: 'membership_joining',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '01712345678',
  user_id: 123,
  reference_id: '123'
});

// 2. Open bKash URL in popup
window.open(response.data.bkashURL);

// 3. Poll for status
setInterval(() => {
  const status = await bkashService.queryPayment(paymentID);
  if (status === 'Completed') {
    // Execute payment
    await bkashService.executePayment({ paymentID, status: 'success' });
  }
}, 3000);
```

## Environment Variables

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Usage Examples

### Basic Usage (with customer form)
```tsx
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';

<PaymentMethodSelector
  amount={1400}
  paymentType="membership_joining"
  onSuccess={(payment) => console.log('Success:', payment)}
  onError={(error) => console.log('Error:', error)}
/>
```

### Pre-filled Customer Info (without form)
```tsx
<PaymentMethodSelector
  amount={1400}
  paymentType="membership_joining"
  customerInfo={{
    name: 'John Doe',
    email: 'john@example.com',
    phone: '01712345678'
  }}
  hideCustomerForm={true}
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

### With User/Reference IDs
```tsx
<PaymentMethodSelector
  amount={500}
  paymentType="monthly_payment"
  userId={123}
  referenceId="INV-2024-001"
  onSuccess={handleSuccess}
/>
```

## Payment Types

The system supports various payment types:
- `membership_joining` - Initial membership fee
- `monthly_payment` - Monthly pension contributions
- `donation` - One-time donations
- `project_funding` - Project contributions
- Custom types as needed

## Features

### 1. Auto-Polling
- Checks payment status every 3 seconds
- Timeout after 5 minutes
- Auto-closes payment window on completion

### 2. Error Handling
- Network errors
- Payment cancellation
- Payment timeout
- Invalid payment data

### 3. User Experience
- Loading states
- Toast notifications
- Cancel button during processing
- Clear error messages

### 4. Data Persistence
- Stores application data in localStorage
- Clears data after successful payment
- Maintains form state during payment

## Backend Requirements

Your Laravel backend should have these endpoints:

### POST `/api/v1/bkash/create-payment`
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

Response:
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

### POST `/api/v1/bkash/execute-payment`
```json
{
  "paymentID": "TR0011abc123",
  "status": "success"
}
```

### POST `/api/v1/bkash/query-payment`
```json
{
  "paymentID": "TR0011abc123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "transactionStatus": "Completed"
  }
}
```

## Testing

### Sandbox Testing
1. Use bKash sandbox credentials
2. Test phone numbers: 01770618567, 01770618568, etc.
3. Test OTP: 123456

### Test Scenarios
- ✅ Successful payment
- ❌ Payment cancellation
- ❌ Payment timeout
- ❌ Network errors
- ❌ Invalid payment data

## Future Enhancements

### Planned Features
1. Payment history tracking
2. Refund support
3. Partial payments
4. Recurring payments
5. Payment reminders
6. Receipt generation

### Additional Payment Methods
- SSLCommerz integration (placeholder added)
- Nagad integration
- Rocket integration
- Bank transfer

## Troubleshooting

### Payment window doesn't open
- Check popup blocker settings
- Verify API URL in environment variables
- Check browser console for errors

### Payment status not updating
- Verify polling is working (check network tab)
- Check backend query-payment endpoint
- Ensure paymentID is correct

### Payment succeeds but doesn't redirect
- Check onSuccess callback
- Verify router.push() is working
- Check for JavaScript errors

## Security Considerations

1. **Token Management**: Auth tokens stored in localStorage
2. **HTTPS Required**: Use HTTPS in production
3. **Input Validation**: Validate all payment data
4. **Error Messages**: Don't expose sensitive info in errors
5. **Rate Limiting**: Implement on backend

## Support

For issues or questions:
- Email: support@exprowelfare.org
- Phone: +880 1234-567890
- Documentation: See NEXTJS_BKASH_IMPLEMENTATION.md

## License

This integration is part of the Expro Welfare Foundation project.
