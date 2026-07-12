# Backend Configuration for Pension Payment

## Required Changes

### 1. Environment Variables

Add to your `.env` file:

```env
# Frontend URL
FRONTEND_URL=http://localhost:3000

# Pension Payment Success URL
PENSION_SUCCESS_URL=${FRONTEND_URL}/pension/payment-success
```

**Production:**
```env
FRONTEND_URL=https://yourdomain.com
PENSION_SUCCESS_URL=${FRONTEND_URL}/pension/payment-success
```

### 2. Payment Type Detection

The backend needs to detect pension payments and redirect accordingly.

**In your bKash callback handler:**

```php
// After processing bKash callback successfully
if ($payment->payment_type === 'pension_installment') {
    // Get enrollment ID from payment metadata
    $metadata = json_decode($payment->metadata, true);
    $enrollmentId = $metadata['enrollment_id'] ?? null;
    
    // Redirect to pension success page
    $redirectUrl = config('app.frontend_url') . '/pension/payment-success';
    $redirectUrl .= '?enrollment_id=' . $enrollmentId;
    $redirectUrl .= '&payment_id=' . $payment->id;
    $redirectUrl .= '&paymentID=' . $bkashPaymentID;
    $redirectUrl .= '&status=' . ($success ? 'success' : 'failed');
    
    return redirect($redirectUrl);
}
```

### 3. Payment Response Format

When initiating pension payment, return this format:

```php
// POST /api/v1/pension-enrollment/pay/{enrollment_id}

return response()->json([
    'success' => true,
    'message' => "Payment initiated for {$count} installment(s). Please complete payment.",
    'data' => [
        'payment_id' => $payment->id,
        'payment_method' => 'bkash',
        'bkashURL' => $bkashURL,
        'paymentID' => $bkashPaymentID,
        'amount' => $totalAmount,
        'currency' => 'BDT',
    ]
]);
```

**Example Response:**
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

### 4. bKash Create Payment Configuration

When creating bKash payment for pension installments:

```php
$bkashPayment = [
    'mode' => '0011',
    'payerReference' => $user->id,
    'callbackURL' => config('app.url') . '/api/v1/bkash/callback',
    'amount' => $totalAmount,
    'currency' => 'BDT',
    'intent' => 'sale',
    'merchantInvoiceNumber' => $payment->payment_id,
];

// Store payment type for callback detection
$payment->update([
    'payment_type' => 'pension_installment',
    'metadata' => json_encode([
        'enrollment_id' => $enrollmentId,
        'installment_count' => $count,
    ]),
]);
```

### 5. Callback Processing Flow

```
1. User completes payment on bKash
   ↓
2. bKash redirects to: /api/v1/bkash/callback
   ↓
3. Backend verifies payment with bKash API
   ↓
4. Backend updates installments as paid
   ↓
5. Backend processes commission (30 TK per installment)
   ↓
6. Backend detects payment_type === 'pension_installment'
   ↓
7. Backend redirects to: /pension/payment-success?enrollment_id=40&payment_id=242&paymentID=xxx&status=success
```

### 6. Database Updates

After successful payment:

```php
// Update installments
DB::table('pension_installments')
    ->whereIn('id', $installmentIds)
    ->update([
        'status' => 'paid',
        'paid_date' => now(),
        'amount_paid' => DB::raw('total_amount'),
        'payment_reference' => $payment->payment_id,
        'commission_processed' => true,
        'commission_processed_at' => now(),
        'updated_at' => now(),
    ]);

// Update enrollment
$enrollment->update([
    'installments_paid' => $enrollment->installments_paid + $count,
    'installments_remaining' => $enrollment->installments_remaining - $count,
    'total_amount_paid' => $enrollment->total_amount_paid + $totalAmount,
    'last_payment_date' => now(),
    'next_due_date' => $nextDueDate,
]);

// Process commission (30 TK per installment)
if ($enrollment->sponsored_by) {
    $commissionAmount = $count * 30;
    
    Commission::create([
        'user_id' => $enrollment->sponsored_by,
        'source_type' => 'pension_installment',
        'source_id' => $payment->id,
        'amount' => $commissionAmount,
        'status' => 'pending',
    ]);
    
    // Dispatch commission processing job
    ProcessCommission::dispatch($enrollment->sponsored_by, $commissionAmount);
}
```

### 7. Frontend Callback Endpoint

The frontend will call this endpoint to confirm payment:

```
POST /api/v1/pension-enrollment/pay/callback
```

**Request:**
```json
{
  "payment_id": 240,
  "status": "success",
  "gateway_transaction_id": "TR0011a2gQVNA1775802801215"
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

**Important:** This endpoint should be idempotent - calling it multiple times with the same payment_id should return the same result without errors.

### 8. Error Handling

**If payment fails:**
```php
$redirectUrl = config('app.frontend_url') . '/pension/payment-success';
$redirectUrl .= '?enrollment_id=' . $enrollmentId;
$redirectUrl .= '&payment_id=' . $payment->id;
$redirectUrl .= '&status=failed';
$redirectUrl .= '&reason=' . urlencode($failureReason);

return redirect($redirectUrl);
```

**If payment is cancelled:**
```php
$redirectUrl = config('app.frontend_url') . '/pension/payment-success';
$redirectUrl .= '?enrollment_id=' . $enrollmentId;
$redirectUrl .= '&payment_id=' . $payment->id;
$redirectUrl .= '&status=cancelled';

return redirect($redirectUrl);
```

### 9. Validation Rules

**For payment initiation:**
```php
$request->validate([
    'count' => 'required|integer|min:1',
    'payment_method' => 'sometimes|string|in:bkash,sslcommerz',
]);

// Check if count exceeds remaining installments
if ($count > $enrollment->installments_remaining) {
    return response()->json([
        'success' => false,
        'message' => "Requested {$count} installments exceed remaining {$enrollment->installments_remaining} installments.",
    ], 400);
}
```

### 10. Activity Logging

Log all payment activities:

```php
ActivityLog::create([
    'user_id' => $user->id,
    'action' => 'pension_payment_initiated',
    'description' => "Initiated payment for {$count} installment(s) of enrollment {$enrollment->enrollment_number}",
    'metadata' => json_encode([
        'payment_id' => $payment->id,
        'enrollment_id' => $enrollment->id,
        'amount' => $totalAmount,
        'installment_count' => $count,
    ]),
]);

// After successful payment
ActivityLog::create([
    'user_id' => $user->id,
    'action' => 'pension_payment_completed',
    'description' => "Completed payment for {$count} installment(s) of enrollment {$enrollment->enrollment_number}",
    'metadata' => json_encode([
        'payment_id' => $payment->id,
        'transaction_id' => $bkashPaymentID,
        'amount' => $totalAmount,
    ]),
]);
```

## Testing Checklist

- [ ] Environment variables set correctly
- [ ] Payment initiation returns correct format
- [ ] bKash callback processes pension payments
- [ ] Installments updated correctly
- [ ] Commission processed (30 TK per installment)
- [ ] Frontend callback endpoint works
- [ ] Redirect to correct frontend URL
- [ ] Error handling works
- [ ] Activity logs created
- [ ] Idempotent callback handling

## Example Implementation

```php
// In PensionEnrollmentController.php

public function initiatePayment(Request $request, $enrollmentId)
{
    $request->validate([
        'count' => 'required|integer|min:1',
        'payment_method' => 'sometimes|string|in:bkash,sslcommerz',
    ]);

    $enrollment = PensionEnrollment::findOrFail($enrollmentId);
    
    // Check authorization
    if ($enrollment->user_id !== auth()->id()) {
        abort(403, 'Unauthorized');
    }

    $count = $request->count;
    
    // Validate count
    if ($count > $enrollment->installments_remaining) {
        return response()->json([
            'success' => false,
            'message' => "Requested {$count} installments exceed remaining {$enrollment->installments_remaining} installments.",
        ], 400);
    }

    // Calculate total amount
    $totalAmount = $enrollment->amount_per_installment * $count;

    // Create payment record
    $payment = Payment::create([
        'user_id' => auth()->id(),
        'payment_type' => 'pension_installment',
        'amount' => $totalAmount,
        'status' => 'pending',
        'metadata' => json_encode([
            'enrollment_id' => $enrollmentId,
            'installment_count' => $count,
        ]),
    ]);

    // Create bKash payment
    $bkashResponse = $this->bkashService->createPayment([
        'amount' => $totalAmount,
        'merchantInvoiceNumber' => $payment->id,
        'callbackURL' => config('app.url') . '/api/v1/bkash/callback',
    ]);

    if ($bkashResponse['success']) {
        return response()->json([
            'success' => true,
            'message' => "Payment initiated for {$count} installment(s). Please complete payment.",
            'data' => [
                'payment_id' => $payment->id,
                'payment_method' => 'bkash',
                'bkashURL' => $bkashResponse['bkashURL'],
                'paymentID' => $bkashResponse['paymentID'],
                'amount' => $totalAmount,
                'currency' => 'BDT',
            ],
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Failed to create payment',
    ], 500);
}
```

## Support

For questions or issues:
- Check Laravel logs: `storage/logs/laravel.log`
- Test with bKash sandbox
- Verify environment variables
- Check database records
- Review activity logs

---

**Last Updated:** April 10, 2026  
**Version:** 1.0
