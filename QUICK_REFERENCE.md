# bKash Payment Integration - Quick Reference Card

## 🚀 Quick Start

### Test the Integration
1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/membership`
3. Fill the registration form (all 6 steps)
4. Click "Proceed to Payment"
5. Payment window should open (requires backend)

## 📋 Key Files

| File | Purpose |
|------|---------|
| `lib/services/bkash.service.ts` | API calls to backend |
| `lib/hooks/useBkashPayment.ts` | Payment logic & state |
| `components/public/membership/ReviewStep.tsx` | Payment initiation |
| `app/payment/bkash/callback/page.tsx` | Payment callback handler |
| `app/(public)/membership/success/page.tsx` | Success page |
| `app/(public)/membership/payment-retry/page.tsx` | Retry page |

## 🔄 Payment Flow (Simple)

```
Form Submit → Backend Creates App → Opens bKash → 
User Pays → Callback → Confirm → Success Page
```

## 🎯 Backend Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/public/membership-application` | Submit app + initiate payment |
| `POST /api/v1/public/membership-application/payment-success` | Confirm payment |
| `POST /api/v1/public/membership-application/payment-failed` | Report failure |
| `POST /api/v1/public/membership-application/{id}/retry-payment` | Retry payment |

## 💾 LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `application_id` | Stores application ID |
| `payment_id` | Stores payment ID |
| `pending_payment_id` | Tracks pending payment |
| `payment_completed` | Marks payment as done |

## 🧪 Test Credentials (Sandbox)

- **Phone**: 01770618567, 01770618568, 01770618569
- **OTP**: 123456
- **PIN**: Any 4 digits

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## 📊 Application Statuses

| Status | Meaning |
|--------|---------|
| `payment_pending` | Waiting for payment |
| `submitted` | Payment complete, under review |
| `under_review` | Admin reviewing |
| `approved` | Approved |
| `rejected` | Rejected |

## 🎨 User Journey

1. **Fill Form** → 6-step registration form
2. **Review** → See all details + payment amount
3. **Submit** → Click "Proceed to Payment"
4. **Pay** → Complete payment in bKash window
5. **Callback** → Automatic redirect after payment
6. **Success** → Confirmation page

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Payment window doesn't open | Check popup blocker |
| Callback not working | Verify backend callback URL |
| Payment ID not found | Check localStorage |
| Status not updating | Check backend endpoint |

## 📱 Payment Methods

- **bKash** ✅ Implemented
- **SSLCommerz** ⏳ Coming soon

## 🔐 Security Checklist

- [x] Payment validation on backend
- [x] Transaction verification
- [x] Status management
- [x] Data cleanup after completion
- [x] Error logging

## 📞 Support

- **Email**: support@exprowelfare.org
- **Docs**: See `MEMBERSHIP_PAYMENT_INTEGRATION.md`

## ✅ Testing Checklist

### Frontend (No Backend)
- [x] Files created
- [x] No TypeScript errors
- [x] Components render
- [x] Forms work

### With Backend
- [ ] Application submission
- [ ] Payment window opens
- [ ] Payment success flow
- [ ] Payment failure flow
- [ ] Payment retry
- [ ] Callback handling

## 🎯 Key Functions

### useBkashPayment Hook
```typescript
const { 
  openPaymentGateway,    // Open payment window
  confirmPaymentSuccess, // Confirm with backend
  reportPaymentFailure,  // Report failure
  retryPayment,          // Retry payment
  cancelPayment,         // Cancel payment
  loading                // Loading state
} = useBkashPayment({ onSuccess, onError });
```

### bkashService
```typescript
// Confirm payment
await bkashService.confirmPaymentSuccess({
  payment_id: 123,
  gateway_transaction_id: 'TR123'
});

// Report failure
await bkashService.reportPaymentFailure({
  payment_id: 123,
  failure_reason: 'User cancelled'
});

// Retry payment
await bkashService.retryPayment(applicationId, {
  payment_method: 'bkash'
});
```

## 📝 Payment Request Format

```json
{
  "name_english": "John Doe",
  "email": "john@example.com",
  "mobile": "01712345678",
  ...
  "payment_method": "bkash"
}
```

## 📥 Payment Response Format

```json
{
  "success": true,
  "data": {
    "application": { "id": 123, "status": "payment_pending" },
    "payment": {
      "payment_id": 456,
      "bkashURL": "https://...",
      "amount": 1400
    }
  }
}
```

## 🎨 UI Components

### Payment Instructions Modal
- Shows after submission
- Payment amount breakdown
- Clear instructions
- Retry option

### Callback Page
- Processing spinner
- Success/failure icons
- Auto-redirect

### Success Page
- Confirmation message
- Next steps
- Support links

### Retry Page
- Payment method selector
- Application ID
- Retry button

## 🚀 Deployment Steps

1. ✅ Code complete
2. ⏳ Test with backend
3. ⏳ Sandbox testing
4. ⏳ Production config
5. ⏳ Deploy

## 📚 Documentation Files

1. `MEMBERSHIP_PAYMENT_INTEGRATION.md` - Main guide
2. `IMPLEMENTATION_SUMMARY.md` - Summary
3. `BKASH_QUICK_START.md` - Quick start
4. `QUICK_REFERENCE.md` - This file

## 💡 Pro Tips

1. Always check browser console for errors
2. Monitor network tab for API calls
3. Check localStorage for stored IDs
4. Test with different browsers
5. Clear localStorage between tests

## ✨ Status

**✅ Implementation Complete**  
**✅ No TypeScript Errors**  
**✅ Ready for Backend Testing**  
**⏳ Awaiting Backend Integration**

---

**Last Updated**: Implementation complete  
**Version**: 1.0  
**Status**: Ready for Testing 🎉
