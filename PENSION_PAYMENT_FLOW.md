# Pension Payment Flow - Complete Guide

## 🔄 Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                              │
└─────────────────────────────────────────────────────────────────┘

1. User navigates to /dashboard/pensions
   ↓
2. Sees payment alert (if installments due)
   ↓
3. Clicks "Pay Now" button
   ↓
4. Payment modal opens
   ↓
5. Selects number of installments (1-12+)
   ↓
6. Reviews total amount
   ↓
7. Clicks "Pay ৳X,XXX with bKash"

┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND PROCESSING                          │
└─────────────────────────────────────────────────────────────────┘

8. Frontend calls API:
   POST /api/v1/pension-enrollment/pay/{enrollment_id}
   Body: { count: 3, payment_method: "bkash" }
   ↓
9. Receives response:
   {
     "success": true,
     "message": "Payment initiated...",
     "data": {
       "payment_id": 240,
       "bkashURL": "https://sandbox.payment.bkash.com/...",
       "paymentID": "TR0011...",
       "amount": "1000.00"
     }
   }
   ↓
10. Stores payment_id in localStorage
    ↓
11. Redirects to bKash URL (window.location.href)

┌─────────────────────────────────────────────────────────────────┐
│                      BKASH PROCESSING                            │
└─────────────────────────────────────────────────────────────────┘

12. User enters bKash credentials:
    - Phone: 01770618567
    - PIN: 1234
    - OTP: 123456
    ↓
13. User confirms payment
    ↓
14. bKash processes payment
    ↓
15. bKash redirects to backend callback:
    GET /api/v1/bkash/callback?paymentID=TR0011...&status=success

┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND PROCESSING                           │
└─────────────────────────────────────────────────────────────────┘

16. Backend receives bKash callback
    ↓
17. Backend verifies payment with bKash API
    ↓
18. Backend updates database:
    - Mark installments as paid
    - Update enrollment totals
    - Record payment reference
    ↓
19. Backend processes commission:
    - Calculate: 30 TK × installment_count
    - Credit to sponsor account
    - Mark commission as processed
    ↓
20. Backend logs activity
    ↓
21. Backend detects payment_type === 'pension_installment'
    ↓
22. Backend redirects to frontend:
    ${FRONTEND_URL}/dashboard/pensions/payment-callback?paymentID=TR0011...&status=success

┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND CALLBACK PROCESSING                    │
└─────────────────────────────────────────────────────────────────┘

23. Payment success page loads
    ↓
24. Shows "Processing Payment..." spinner
    ↓
25. Retrieves payment_id from URL or localStorage
    ↓
26. Calls confirmation API:
    POST /api/v1/pension-enrollment/pay/callback
    Body: {
      payment_id: 242,
      status: "success",
      gateway_transaction_id: "TR0011..."
    }
    ↓
27. Receives confirmation:
    {
      "success": true,
      "message": "Payment completed successfully",
      "status": "completed"
    }
    ↓
28. Fetches updated enrollment data
    ↓
29. Shows success message with payment details
    ↓
30. Displays enrollment information
    ↓
31. User clicks "View Pension Details"
    ↓
32. Redirects to /dashboard/pensions

## 📊 Data Flow

### Request Data
```typescript
// Step 8: Payment Initiation
{
  count: 3,
  payment_method: "bkash"
}
```

### Response Data
```typescript
// Step 9: Payment Response
{
  success: true,
  message: "Payment initiated for 3 installment(s)...",
  data: {
    payment_id: 240,
    payment_method: "bkash",
    bkashURL: "https://sandbox.payment.bkash.com/?paymentId=TR0011...",
    paymentID: "TR0011a2gQVNA1775802801215",
    amount: "3000.00",
    currency: "BDT"
  }
}
```

### Callback Data
```typescript
// Step 26: Confirmation Request
{
  payment_id: 240,
  status: "success",
  gateway_transaction_id: "TR0011a2gQVNA1775802801215"
}

// Step 27: Confirmation Response
{
  success: true,
  message: "Payment PAY-xxx has already been completed.",
  status: "completed",
  payment_id: "PAY-xxx"
}
```

## 🗄️ Database Updates

### Installments Table
```sql
-- Step 18: Mark as paid
UPDATE pension_installments SET
  status = 'paid',
  paid_date = '2026-04-10 10:05:30',
  amount_paid = total_amount,
  payment_reference = 'PAY-240',
  commission_processed = true,
  commission_processed_at = '2026-04-10 10:05:31',
  updated_at = '2026-04-10 10:05:30'
WHERE id IN (1, 2, 3);
```

### Enrollment Table
```sql
-- Step 18: Update totals
UPDATE pension_enrollments SET
  installments_paid = installments_paid + 3,
  installments_remaining = installments_remaining - 3,
  total_amount_paid = total_amount_paid + 3000,
  last_payment_date = '2026-04-10',
  next_due_date = '2026-07-10',
  updated_at = '2026-04-10 10:05:30'
WHERE id = 5;
```

### Commission Table
```sql
-- Step 19: Create commission
INSERT INTO commissions (
  user_id,
  source_type,
  source_id,
  amount,
  status,
  created_at
) VALUES (
  10,                      -- sponsor_id
  'pension_installment',
  240,                     -- payment_id
  90.00,                   -- 30 TK × 3 installments
  'pending',
  '2026-04-10 10:05:31'
);
```

## 🔐 LocalStorage Usage

```typescript
// Step 10: Store before redirect
localStorage.setItem('pending_pension_payment_id', '240');
localStorage.setItem('pending_pension_enrollment_id', '5');

// Step 25: Retrieve in callback
const paymentId = localStorage.getItem('pending_pension_payment_id');
const enrollmentId = localStorage.getItem('pending_pension_enrollment_id');

// Step 29: Clear after success
localStorage.removeItem('pending_pension_payment_id');
localStorage.removeItem('pending_pension_enrollment_id');
localStorage.removeItem('pension_payment_completed');
```

## 🎯 Key URLs

### Frontend URLs
```
Main Page:        /dashboard/pensions
Success Page:     /pension/payment-success
Legacy Callback:  /dashboard/pensions/payment-callback (kept for compatibility)
```

### Backend URLs
```
Initiate:         POST /api/v1/pension-enrollment/pay/{enrollment_id}
Confirm:          POST /api/v1/pension-enrollment/pay/callback
bKash Callback:   GET  /api/v1/bkash/callback
```

### bKash URLs
```
Sandbox:          https://sandbox.payment.bkash.com/?paymentId=...
Production:       https://payment.bkash.com/?paymentId=...
```

## ⏱️ Timing

| Step | Action | Duration |
|------|--------|----------|
| 1-7 | User interaction | ~30 seconds |
| 8-11 | Frontend processing | ~2 seconds |
| 12-15 | bKash payment | ~30-60 seconds |
| 16-22 | Backend processing | ~3-5 seconds |
| 23-31 | Frontend callback | ~5 seconds |
| 32-36 | Final display | ~2 seconds |
| **Total** | **Complete flow** | **~1-2 minutes** |

## 🚨 Error Scenarios

### Scenario 1: Payment Initiation Fails
```
Step 8 → API Error
↓
Show error toast
↓
Keep modal open
↓
User can retry
```

### Scenario 2: User Cancels on bKash
```
Step 13 → User clicks Cancel
↓
bKash redirects with status=cancelled
↓
Backend redirects to callback with status=failed
↓
Show failure message
↓
Offer retry option
```

### Scenario 3: Payment Verification Fails
```
Step 17 → bKash verification fails
↓
Backend marks payment as failed
↓
Backend redirects with status=failed
↓
Show error message
↓
User can retry
```

### Scenario 4: Network Error
```
Step 26 → Confirmation API fails
↓
Show error toast
↓
Payment may still be processed
↓
User can check status or contact support
```

## 📱 Mobile Considerations

1. **Direct Redirect**: Works better than popup on mobile
2. **bKash App**: May open bKash app if installed
3. **Return Flow**: Seamless return to web app
4. **Responsive UI**: All pages mobile-optimized

## 🧪 Testing Checklist

- [ ] Payment initiation works
- [ ] bKash redirect successful
- [ ] Payment completes on bKash
- [ ] Backend callback processes correctly
- [ ] Frontend callback confirms payment
- [ ] Database updated correctly
- [ ] Commission processed
- [ ] UI refreshes with new data
- [ ] Success message shown
- [ ] Payment history updated

## 📞 Support

**If payment stuck at any step:**

1. Check browser console for errors
2. Verify localStorage has payment_id
3. Check Laravel logs for backend errors
4. Verify bKash sandbox is working
5. Test with different browser
6. Clear cache and retry

**Common Issues:**

- **Popup blocked**: Use direct redirect (already implemented)
- **Callback not working**: Check FRONTEND_URL in backend .env
- **Payment not confirming**: Check idempotent callback handling
- **Commission not processing**: Verify sponsor relationship

---

**Flow Version:** 1.0  
**Last Updated:** April 10, 2026  
**Status:** Production Ready 🚀
