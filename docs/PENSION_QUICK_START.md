# Pension Payment - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. View Your Pensions
Navigate to: `/dashboard/pensions`

You'll see:
- ✅ Payment alerts (if any due)
- 📊 Summary stats (active plans, total paid, maturity)
- 📦 All your enrollments with installment tables

### 2. Pay an Installment

**Option A: From Alert Banner**
```
Click "Pay Now" on red (overdue) or amber (current month) alert
```

**Option B: From Installment Table**
```
Find the installment row → Click "Pay Now" button
```

### 3. Select Payment Amount

In the modal:
1. Click a number (1-12) for quick selection
2. Or enter a custom amount (up to remaining installments)
3. Review the installments to be paid
4. Check the total amount

### 4. Complete Payment

1. Click "Pay ৳X,XXX with bKash"
2. bKash window opens
3. Enter credentials:
   - Phone: `01770618567`
   - PIN: `1234`
   - OTP: `123456`
4. Confirm payment
5. Wait for redirect

### 5. Confirmation

- ✅ Success page shows
- 🔄 Data refreshes automatically
- 📧 Confirmation notification
- 💰 Commission processed

## 📱 User Flow

```
Dashboard → Pensions → Pay Now → Select Count → bKash → Success
```

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Payment Alerts** | See overdue and current month due |
| **Flexible Payment** | Pay 1 to 12+ installments at once |
| **Real-time Status** | Instant payment confirmation |
| **Commission** | Auto-credited to sponsor (30 TK/installment) |
| **History** | Complete payment history per enrollment |

## 🔧 For Developers

### Quick Test

```bash
# 1. Start dev server
npm run dev

# 2. Login as member with pension enrollment

# 3. Navigate to
http://localhost:3000/dashboard/pensions

# 4. Click "Pay Now" on any unpaid installment

# 5. Select count and pay

# 6. Use bKash sandbox credentials
```

### Key Files

```
app/(auth)/dashboard/pensions/
├── page.tsx                          # Main page
└── payment-callback/page.tsx         # Callback handler

components/dashboard/pensions/
└── PensionPaymentModal.tsx           # Payment modal

lib/
├── services/pensionPayment.service.ts # API service
└── hooks/user/usePensionPayment.ts   # Payment hook
```

### API Endpoints

```typescript
// Initiate payment
POST /api/v1/pension-enrollment/pay/{enrollment_id}
Body: { count: 3, payment_method: "bkash" }

// Complete payment
POST /api/v1/pension-enrollment/pay/callback
Body: { payment_id: 123, status: "success", gateway_transaction_id: "TR..." }
```

## 🧪 Testing Checklist

- [ ] View pension page
- [ ] See payment alerts (if any due)
- [ ] Click "Pay Now"
- [ ] Select installment count
- [ ] Initiate payment
- [ ] Complete on bKash sandbox
- [ ] Verify callback success
- [ ] Check data refresh
- [ ] Verify commission processed

## 🐛 Troubleshooting

### Payment window blocked?
**Solution:** Enable popups in browser settings

### Payment not completing?
**Check:**
1. localStorage has `pending_pension_payment_id`
2. Backend callback URL is correct
3. bKash sandbox is working
4. Check browser console for errors

### Callback not working?
**Verify:**
1. `FRONTEND_URL` in backend .env
2. Callback route exists
3. CORS settings allow requests
4. Test direct URL access

## 📚 Documentation

- **Complete Guide**: `PENSION_PAYMENT_INTEGRATION.md`
- **API Reference**: `MEMBER_PENSION_INSTALLMENT_APIS.md`
- **UI Guide**: `PENSION_UI_GUIDE.md`
- **Summary**: `PENSION_PAYMENT_SUMMARY.md`

## 🎨 UI Preview

### Payment Alert
```
⚠️  PAYMENT REQUIRED
You have 2 unpaid installments totaling ৳2,000

🔴 OVERDUE PAYMENTS (1)
EN-2024-001 - Installment #1
Due: Mar 10, 2026 • ৳1,000        [Pay Now →]
```

### Payment Modal
```
💳 Pay Pension Installments
EN-2024-001

How many installments? [1] [2] [3] [4] [5] [6]

Total Amount: ৳3,000

[Cancel]  [💳 Pay ৳3,000 with bKash]
```

## 💡 Tips

1. **Pay Multiple**: Save time by paying multiple installments at once
2. **Check Alerts**: Red alerts are overdue - pay these first
3. **Track Progress**: View payment progress bar on each enrollment
4. **Commission**: Sponsor gets 30 TK per installment automatically
5. **History**: All payments tracked in installment table

## 🔐 Security

- ✅ Bearer token authentication
- ✅ User can only pay own enrollments
- ✅ Idempotent callbacks
- ✅ Transaction IDs stored
- ✅ Secure bKash integration

## 📞 Support

**Need Help?**
- Check documentation files
- Review browser console
- Check Laravel logs
- Test with sandbox credentials
- Contact system admin

## 🎉 Success Indicators

After successful payment:
- ✅ Success message displayed
- ✅ Installment status updated to "Paid"
- ✅ Payment date recorded
- ✅ Commission processed
- ✅ Next due date updated
- ✅ Progress bar updated

---

**Quick Start Version:** 1.0  
**Last Updated:** April 10, 2026  
**Status:** Ready to Use 🚀
