# Pension Payment UI Guide

## Visual Overview

### 1. Main Pension Page

```
┌─────────────────────────────────────────────────────────────┐
│ Pension Plans                                                │
│ Manage your pension enrollments and track payment schedules │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ⚠️  PAYMENT REQUIRED                                         │
│                                                              │
│ You have 2 unpaid installments totaling ৳2,000              │
│                                                              │
│ 🔴 OVERDUE PAYMENTS (1)                                     │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ EN-2024-001 - Installment #1                          │  │
│ │ Due: Mar 10, 2026 • ৳1,000                           │  │
│ │                                    [Pay Now →]        │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ 🟡 CURRENT MONTH DUE (1)                                    │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ EN-2024-001 - Installment #2                          │  │
│ │ Due: Apr 10, 2026 • ৳1,000                           │  │
│ │                                    [Pay Now →]        │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ 📦 Active    │ ✅ Total     │ 📈 Expected  │
│    Plans     │    Paid      │    Maturity  │
│              │              │              │
│    2         │  ৳15,000     │  ৳100,000    │
└──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Your Pension Enrollments                                     │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 📦 EN-2024-001          [Active]      Maturity: ৳50,000│  │
│ │ 📅 Enrolled Mar 10, 2024  🎯 Matures Mar 10, 2034     │  │
│ │                                                        │  │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│ │ Payment Progress: 12/100 (12.0%)                      │  │
│ │ Paid ৳12,000 • 1 missed • 88 remaining                │  │
│ │                                                        │  │
│ │ Monthly: ৳1,000  Total Due: ৳100,000  Next: Apr 10    │  │
│ │                                                        │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ # │ Due Date    │ Amount │ Status  │ Action    │   │  │
│ │ ├───┼─────────────┼────────┼─────────┼───────────┤   │  │
│ │ │ 1 │ Mar 10,2026 │ ৳1,000 │ [Paid]  │ ✅ Paid   │   │  │
│ │ │ 2 │ Apr 10,2026 │ ৳1,000 │ [Due]   │ [Pay Now] │   │  │
│ │ │ 3 │ May 10,2026 │ ৳1,000 │[Upcoming]│    -     │   │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Payment Modal

```
┌─────────────────────────────────────────────────────────────┐
│ 💳 Pay Pension Installments                          [X]    │
│    EN-2024-001                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 📦 Enrollment Details                                  │  │
│ │ Monthly Payment: ৳1,000    Remaining: 88 installments │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ How many installments do you want to pay?                   │
│                                                              │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                       │
│ │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │                       │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                       │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                       │
│ │ 7 │ │ 8 │ │ 9 │ │10 │ │11 │ │12 │                       │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                       │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Installments to be Paid                                │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ #1  Due: Apr 10, 2026              ৳1,000       │   │  │
│ │ │ #2  Due: May 10, 2026              ৳1,000       │   │  │
│ │ │ #3  Due: Jun 10, 2026              ৳1,000       │   │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Installments Selected: 3                               │  │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│ │ Total Amount:                              ৳3,000     │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ ⚠️  Payment Information                                     │
│ • You will be redirected to bKash payment gateway          │
│ • Installments will be paid in sequential order            │
│ • Payment confirmation may take a few moments              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    [Cancel]  [💳 Pay ৳3,000 with bKash]    │
└─────────────────────────────────────────────────────────────┘
```

### 3. Payment Callback - Processing

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         ⏳                                   │
│                                                              │
│                  Processing Payment                          │
│                                                              │
│         Please wait while we confirm your payment...         │
│                                                              │
│                      • • •                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4. Payment Callback - Success

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         ✅                                   │
│                                                              │
│                  Payment Successful!                         │
│                                                              │
│    Your pension installment payment has been completed       │
│         successfully. You will be redirected shortly...      │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Your installments have been updated and commission     │  │
│ │ processing has been initiated.                         │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5. Payment Callback - Failed

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         ❌                                   │
│                                                              │
│                    Payment Failed                            │
│                                                              │
│    Your payment could not be completed. Please try again     │
│           or contact support if the issue persists.          │
│                                                              │
│              [Return to Pensions]                            │
│              [Go to Dashboard]                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Status Colors

- **Active/Success**: Emerald (#068847, #F0FDF4)
- **Overdue/Error**: Red (#DC2626, #FEE2E2)
- **Due/Warning**: Amber (#F59E0B, #FEF3C7)
- **Upcoming/Info**: Sky (#0EA5E9, #E0F2FE)
- **Paid**: Emerald (#10B981, #D1FAE5)
- **Neutral**: Gray (#6B7280, #F3F4F6)

### Gradients

- **Alert Banner**: `from-amber-50 to-orange-50`
- **Success**: `from-emerald-50 to-teal-50`
- **Info**: `from-blue-50 to-indigo-50`
- **Background**: `from-emerald-50 via-teal-50 to-cyan-50`

## Typography

- **Headings**: Bold, 16-24px
- **Body Text**: Regular, 14px
- **Labels**: Medium, 14px
- **Small Text**: Regular, 12-13px
- **Monospace**: Font-mono for IDs and numbers

## Spacing

- **Container**: max-w-7xl, px-4, py-6
- **Cards**: p-5 to p-8
- **Gaps**: space-y-6 (24px)
- **Grid Gaps**: gap-3 to gap-4

## Interactive Elements

### Buttons

**Primary (Pay Now)**
```
bg-[#068847] hover:bg-[#057a3d]
text-white, font-semibold
px-8 py-3, rounded-xl
shadow-lg
```

**Secondary (Cancel)**
```
text-[#6B7280] hover:bg-[#F3F4F6]
font-medium
px-6 py-3, rounded-xl
```

**Installment Selector**
```
Selected: bg-[#068847] text-white shadow-lg scale-105
Unselected: bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]
```

### Cards

**Enrollment Card**
```
bg-white rounded-xl border border-[#E5E7EB]
hover:shadow-lg transition-shadow
```

**Alert Card**
```
bg-gradient-to-r from-amber-50 to-orange-50
border border-amber-200
rounded-xl p-5
```

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Stacked stats cards
- Full-width buttons
- Simplified table (horizontal scroll)

### Tablet (768px - 1024px)
- 2-column grid for stats
- Compact enrollment cards
- Side-by-side buttons

### Desktop (> 1024px)
- 3-column grid for stats
- Full enrollment details
- Optimized table layout
- Modal centered with max-width

## Animations

- **Loading**: Spinner with `animate-spin`
- **Bounce**: Dots with `animate-bounce`
- **Pulse**: Skeleton with `animate-pulse`
- **Transitions**: `transition-all duration-200/500`
- **Hover**: `hover:shadow-lg`, `hover:scale-105`

## Icons

- **Package**: Enrollment/Plans
- **CreditCard**: Payment
- **Calendar**: Dates
- **TrendingUp**: Growth/Maturity
- **Layers**: Progress
- **AlertTriangle**: Warnings
- **CheckCircle2**: Success
- **XCircle**: Error/Failed
- **Clock**: Pending/Due
- **ArrowRight**: Actions

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast ratios meet WCAG AA
- Loading states announced
- Error messages clear and actionable

## Best Practices

1. **Consistent Spacing**: Use Tailwind spacing scale
2. **Color Consistency**: Use defined color palette
3. **Font Sizes**: Stick to 14px base
4. **Loading States**: Always show loading indicators
5. **Error Handling**: Clear error messages
6. **Success Feedback**: Confirm actions
7. **Responsive**: Test on all screen sizes
8. **Performance**: Optimize images and animations

---

**Design System Version:** 1.0  
**Last Updated:** April 10, 2026
