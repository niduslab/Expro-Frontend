# Member Pension Installment APIs

## Overview

This document provides complete API documentation for members to manage and pay their pension installments.

---

## Base URL

```
https://your-domain.com/api/v1
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## API Endpoints

### 1. Get My Pension Installments

Get all pension installments for the authenticated member.

**Endpoint:** `GET /api/v1/mypensioninstallments`

**Method:** GET

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `filter[status]` | string | Filter by status | `due`, `paid`, `overdue`, `upcoming` |
| `filter[due_date]` | date | Filter by due date | `2024-04-10` |
| `search` | string | Search in payment_reference, notes | `PAY-123` |
| `sort` | string | Sort field | `due_date`, `created_at` |
| `order` | string | Sort order | `asc`, `desc` |
| `per_page` | integer | Items per page | `15` (default) |

**Request Example:**

```bash
curl -X GET "https://your-domain.com/api/v1/mypensioninstallments?filter[status]=due&sort=due_date&order=asc" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

**Response Example:**

```json
{
  "success": true,
  "message": "My pension installments fetched successfully.",
  "data": [
    {
      "id": 1,
      "pension_enrollment_id": 5,
      "user_id": 10,
      "installment_number": 1,
      "due_date": "2024-04-10",
      "amount": 1000.00,
      "late_fee": 0.00,
      "total_amount": 1000.00,
      "paid_date": null,
      "amount_paid": 0.00,
      "payment_reference": null,
      "status": "due",
      "commission_processed": false,
      "created_at": "2024-03-10T10:00:00.000000Z",
      "updated_at": "2024-03-10T10:00:00.000000Z",
      "pension_enrollment": {
        "id": 5,
        "pension_package_id": 2,
        "user_id": 10,
        "total_installments": 100,
        "amount_per_installment": 1000.00,
        "status": "active"
      }
    },
    {
      "id": 2,
      "pension_enrollment_id": 5,
      "user_id": 10,
      "installment_number": 2,
      "due_date": "2024-05-10",
      "amount": 1000.00,
      "late_fee": 0.00,
      "total_amount": 1000.00,
      "paid_date": null,
      "amount_paid": 0.00,
      "payment_reference": null,
      "status": "upcoming",
      "commission_processed": false,
      "created_at": "2024-03-10T10:00:00.000000Z",
      "updated_at": "2024-03-10T10:00:00.000000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "per_page": 15,
    "current_page": 1,
    "last_page": 7
  }
}
```

---

### 2. Get Next Upcoming Installment

Get the next upcoming installment that needs to be paid.

**Endpoint:** `GET /api/v1/pensioninstallments/next-upcoming`

**Method:** GET

**Authentication:** Required

**Request Example:**

```bash
curl -X GET "https://your-domain.com/api/v1/pensioninstallments/next-upcoming" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

**Response Example (Found):**

```json
{
  "success": true,
  "message": "Next upcoming installment fetched successfully.",
  "data": {
    "id": 1,
    "pension_enrollment_id": 5,
    "user_id": 10,
    "installment_number": 1,
    "due_date": "2024-04-10",
    "amount": 1000.00,
    "late_fee": 0.00,
    "total_amount": 1000.00,
    "paid_date": null,
    "amount_paid": 0.00,
    "payment_reference": null,
    "status": "due",
    "commission_processed": false,
    "pension_enrollment": {
      "id": 5,
      "pension_package_id": 2,
      "pension_package": {
        "id": 2,
        "name": "Standard Pension Package",
        "total_amount": 100000.00,
        "installment_amount": 1000.00,
        "total_installments": 100
      }
    }
  }
}
```

**Response Example (Not Found):**

```json
{
  "success": true,
  "message": "No upcoming installments found.",
  "data": null
}
```

---

### 3. Pay Pension Installments

Initiate payment for one or more pension installments.

**Endpoint:** `POST /api/v1/pension-enrollment/pay/{enrollment_id}`

**Method:** POST

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enrollment_id` | integer | Yes | Pension enrollment ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `count` | integer | Yes | Number of installments to pay (minimum: 1) |
| `payment_method` | string | No | Payment method (default: `sslcommerz`) |

**Request Example:**

```bash
curl -X POST "https://your-domain.com/api/v1/pension-enrollment/pay/5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "count": 3,
    "payment_method": "bkash"
  }'
```

**Response Example (Success):**

```json
{
  "success": true,
  "message": "Payment 123 initiated for 3 installment(s). Please proceed to payment gateway.",
  "payment_id": 123
}
```

**Response Example (Error - Exceeds Remaining):**

```json
{
  "success": false,
  "message": "Requested 5 installments exceed remaining 3 installments."
}
```

**Response Example (Error - Invalid Count):**

```json
{
  "message": "Installment count must be greater than 0"
}
```

---

### 4. Payment Callback

Complete the payment after returning from payment gateway.

**Endpoint:** `POST /api/v1/pension-enrollment/pay/callback`

**Method:** POST

**Authentication:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payment_id` | integer | Yes | Payment ID from initiation response |
| `status` | string | Yes | Payment status: `success` or `failed` |
| `gateway_transaction_id` | string | No | Transaction ID from gateway |

**Request Example:**

```bash
curl -X POST "https://your-domain.com/api/v1/pension-enrollment/pay/callback" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "payment_id": 123,
    "status": "success",
    "gateway_transaction_id": "TRX123456789"
  }'
```

**Response Example (Success):**

```json
{
  "success": true,
  "message": "Payment PAY-xxx has already been completed.",
  "status": "completed",
  "payment_id": "PAY-xxx"
}
```

**Response Example (Already Processed):**

```json
{
  "success": true,
  "message": "Payment PAY-xxx has already been completed.",
  "status": "completed",
  "payment_id": "PAY-xxx"
}
```

**Response Example (Failed):**

```json
{
  "success": false,
  "message": "Payment PAY-xxx has status 'failed', cannot process again.",
  "status": "failed",
  "payment_id": "PAY-xxx"
}
```

---

## Complete Payment Flow

### Step 1: Get Upcoming Installments

```javascript
// Get next upcoming installment
const response = await fetch('/api/v1/pensioninstallments/next-upcoming', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

const { data: installment } = await response.json();

if (installment) {
  console.log(`Next payment: ${installment.total_amount} TK`);
  console.log(`Due date: ${installment.due_date}`);
}
```

### Step 2: Initiate Payment

```javascript
// Pay 3 installments
const response = await fetch(`/api/v1/pension-enrollment/pay/${enrollmentId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    count: 3,
    payment_method: 'bkash'
  })
});

const { payment_id } = await response.json();

// Store payment_id for callback
localStorage.setItem('pending_pension_payment_id', payment_id);

// Note: For bKash, you would get bkashURL and redirect
// This requires integration with bKash create-payment endpoint
```

### Step 3: Redirect to Payment Gateway

```javascript
// After getting bKash URL from bKash create-payment endpoint
window.location.href = bkashURL;
```

### Step 4: Handle Callback

```javascript
// After returning from bKash
const urlParams = new URLSearchParams(window.location.search);
const paymentID = urlParams.get('paymentID');
const status = urlParams.get('status');

if (paymentID && status) {
  const storedPaymentId = localStorage.getItem('pending_pension_payment_id');
  
  if (storedPaymentId) {
    const response = await fetch('/api/v1/pension-enrollment/pay/callback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        payment_id: parseInt(storedPaymentId),
        status: status === 'success' ? 'success' : 'failed',
        gateway_transaction_id: paymentID
      })
    });

    const result = await response.json();
    
    localStorage.removeItem('pending_pension_payment_id');
    
    if (result.success) {
      alert('Payment completed successfully!');
      // Refresh installments list
    } else {
      alert('Payment failed: ' + result.message);
    }
  }
}
```

---

## Installment Status

| Status | Description |
|--------|-------------|
| `upcoming` | Installment is scheduled but not yet due |
| `due` | Installment is due for payment |
| `overdue` | Installment is past due date |
| `paid` | Installment has been paid |
| `partial` | Installment is partially paid |
| `waived` | Installment has been waived |

---

## Payment Methods

| Method | Status | Description |
|--------|--------|-------------|
| `bkash` | ✅ Available | bKash mobile payment |
| `sslcommerz` | ⏳ Pending | SSLCommerz gateway |
| `nagad` | ⏳ Pending | Nagad mobile payment |
| `rocket` | ⏳ Pending | Rocket mobile payment |
| `bank_transfer` | ✅ Available | Bank transfer |
| `cash` | ✅ Available | Cash payment |

---

## Error Codes

| HTTP Code | Error | Description |
|-----------|-------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Not authorized to access this enrollment |
| 404 | Not Found | Enrollment or installment not found |
| 422 | Validation Error | Validation failed |
| 500 | Server Error | Internal server error |

---

## Common Error Responses

### Unauthorized Access

```json
{
  "message": "Unauthorized"
}
```

### Validation Error

```json
{
  "message": "The count field is required.",
  "errors": {
    "count": ["The count field is required."]
  }
}
```

### Enrollment Not Found

```json
{
  "message": "No query results for model [App\\Models\\PensionEnrollment]"
}
```

### Exceeds Remaining Installments

```json
{
  "success": false,
  "message": "Requested 5 installments exceed remaining 3 installments."
}
```

---

## Business Rules

### Payment Rules

1. **Minimum Payment:** Must pay at least 1 installment
2. **Maximum Payment:** Cannot exceed remaining installments
3. **Sequential Payment:** Installments are paid in order (1, 2, 3, ...)
4. **Auto-generation:** If installments don't exist, they are created on-demand
5. **Commission:** 30 TK commission per installment (processed after payment)

### Installment Generation

- Installments are generated when payment is initiated
- If paying 3 installments and only 1 exists, system creates 2 more
- Installment numbers are sequential
- Due dates are monthly from enrollment date

### Late Fees

- Late fees may be added for overdue installments
- Late fee calculation is automatic
- Total amount = amount + late_fee

---

## Testing

### Test Scenarios

1. **Get My Installments**
```bash
curl -X GET "http://localhost:8000/api/v1/mypensioninstallments" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Get Next Upcoming**
```bash
curl -X GET "http://localhost:8000/api/v1/pensioninstallments/next-upcoming" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Pay 1 Installment**
```bash
curl -X POST "http://localhost:8000/api/v1/pension-enrollment/pay/5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 1, "payment_method": "bkash"}'
```

4. **Pay 3 Installments**
```bash
curl -X POST "http://localhost:8000/api/v1/pension-enrollment/pay/5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 3, "payment_method": "bkash"}'
```

5. **Complete Payment**
```bash
curl -X POST "http://localhost:8000/api/v1/pension-enrollment/pay/callback" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": 123,
    "status": "success",
    "gateway_transaction_id": "TRX123"
  }'
```

---

## Integration with bKash

### Complete bKash Flow

```javascript
// Step 1: Initiate pension payment
const initiateResponse = await fetch(`/api/v1/pension-enrollment/pay/${enrollmentId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    count: 3,
    payment_method: 'bkash'
  })
});

const { payment_id } = await initiateResponse.json();

// Step 2: Create bKash payment
const bkashResponse = await fetch('/api/v1/bkash/create-payment', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: totalAmount,
    payment_type: 'pension_installment',
    customer_name: user.name,
    customer_email: user.email,
    customer_phone: user.phone
  })
});

const { data: bkashData } = await bkashResponse.json();

// Store payment_id
localStorage.setItem('pending_pension_payment_id', payment_id);

// Step 3: Redirect to bKash
window.location.href = bkashData.bkashURL;

// Step 4: After bKash redirect back, call callback
// (See Step 4 in Complete Payment Flow above)
```

---

## Summary

### Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/mypensioninstallments` | GET | Get all my installments |
| `/api/v1/pensioninstallments/next-upcoming` | GET | Get next upcoming installment |
| `/api/v1/pension-enrollment/pay/{id}` | POST | Pay installments |
| `/api/v1/pension-enrollment/pay/callback` | POST | Complete payment |

### Key Features

✅ View all installments with filtering  
✅ Get next upcoming installment  
✅ Pay multiple installments at once  
✅ Auto-generation of installments  
✅ bKash payment integration  
✅ Idempotent callback handling  
✅ Commission processing  
✅ Activity logging  

---

## Support

For issues or questions:
- Check logs in `storage/logs/laravel.log`
- Review payment status in database
- Test with bKash sandbox credentials
- Contact system administrator

---

**Last Updated:** April 10, 2026  
**Version:** 1.0  
**Status:** Production Ready
