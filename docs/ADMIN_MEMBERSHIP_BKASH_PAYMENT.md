# Admin Membership with bKash Payment Integration

## Overview
This document describes the implementation of the admin membership feature with mandatory bKash payment integration for pension packages. Admins can create new members directly from the admin panel, and payment via bKash is required when a pension package is selected.

## Key Changes from Previous Implementation

### 1. Mandatory Pension Package Selection
- **Removed**: "Skip" option for pension packages
- **Added**: Validation to ensure a pension package is selected before proceeding
- **Reason**: Admin-created members must have a pension package with payment

### 2. bKash Payment Integration
- **Added**: Payment flow similar to public membership application
- **Payment Method**: bKash only (mandatory)
- **Payment Timing**: Immediate payment required after member creation
- **Payment Amount**: Membership fee (৳400) + First month pension package amount

### 3. Payment Flow
1. Admin fills out all member information
2. Admin selects a pension package (required)
3. Admin reviews all information including payment summary
4. Admin clicks "Proceed to Payment"
5. Backend creates member and initiates bKash payment
6. Admin is redirected to bKash payment gateway
7. After payment, admin is redirected back to the application
8. Member status is updated based on payment result

## Implementation Details

### Modified Files

#### 1. `components/admin/membership/PensionStep.tsx`
**Changes:**
- Removed "Skip" option UI
- Changed `PensionInfoState` type from `"skip" | number` to `number | null`
- Added validation to prevent proceeding without package selection
- Updated UI messages to indicate pension selection is required
- Added disabled state to "Next" button when no package is selected

**Key Code Changes:**
```typescript
// Before
export type PensionInfoState = {
  selectedPackage: "skip" | number;
};

// After
export type PensionInfoState = {
  selectedPackage: number | null;
};
```

```typescript
// Added validation
const canProceed = data.selectedPackage !== null;

// Updated button
<button
  type="button"
  onClick={onNext}
  disabled={!canProceed}
  className={`... ${
    canProceed
      ? "bg-[#068847] text-white hover:bg-[#057038]"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
```

#### 2. `components/admin/membership/AdminMembershipForm.tsx`
**Changes:**
- Updated initial pension state from `'skip'` to `null`

```typescript
// Before
const initialPensionInfo: PensionInfoState = {
  selectedPackage: 'skip',
};

// After
const initialPensionInfo: PensionInfoState = {
  selectedPackage: null,
};
```

#### 3. `components/admin/membership/ReviewStep.tsx`
**Major Changes:**
- Added payment integration with bKash
- Added payment summary display
- Added payment modal for fallback scenarios
- Integrated with admin membership creation API
- Added proper error handling and loading states

**New Imports:**
```typescript
import { useCreateMemberByAdmin } from "@/lib/hooks/admin/useAdminMembership";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
```

**Payment Summary Display:**
```typescript
const membershipFee = 400;
const totalDue = membershipFee + pensionDetails.price;
```

**Submit Handler:**
- Creates member via admin API
- Receives payment URL from backend
- Redirects to bKash payment gateway
- Shows fallback modal if payment URL is not available

### New Files

#### 1. `lib/api/functions/admin/adminMembershipApi.ts`
**Purpose:** API functions for admin member creation with payment

**Key Function:**
```typescript
export const createMemberByAdmin = async (
  payload: AdminCreateMemberInput,
): Promise<AdminCreateMemberResponse>
```

**Endpoint:** `POST /admin/members/create`

**Request Format:** `multipart/form-data` (for file uploads)

**Request Payload:**
```typescript
{
  name_bangla: string;
  name_english: string;
  father_husband_name: string;
  mother_name: string;
  date_of_birth: string; // YYYY-MM-DD
  nid_number: string;
  academic_qualification: string;
  permanent_address: string;
  present_address: string;
  religion: string;
  gender: string;
  mobile: string;
  email: string;
  membership_type: string; // "general"
  sponsor_id?: number;
  pension_package_id: number; // Required
  nominees: Array<{
    name: string;
    relation: string;
    dob: string;
    nominee_mobile?: string;
    nominee_address?: string;
  }>;
  photo: File | null;
  nid_front_photo: File | null;
  nid_back_photo: File | null;
  signature: File | null;
  payment_method: "bkash"; // Always bkash
}
```

**Response Format:**
```typescript
{
  success: boolean;
  message: string;
  data: {
    member: {
      id: number;
      member_id: string;
      name_english: string;
      email: string;
      mobile: string;
      status: string;
    };
    payment: {
      payment_id: number;
      amount: number;
      payment_method: string;
      status: string;
      bkashURL?: string;
      gateway_url?: string;
    };
  };
}
```

#### 2. `lib/hooks/admin/useAdminMembership.ts`
**Purpose:** React Query hook for admin member creation

**Hook:**
```typescript
export const useCreateMemberByAdmin = () => {
  return useMutation({
    mutationFn: (payload: AdminCreateMemberInput) =>
      createMemberByAdmin(payload),
  });
};
```

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Admin fills member information (6 steps)                     │
│    - Personal Info                                               │
│    - Address                                                     │
│    - Nominee                                                     │
│    - Sponsor                                                     │
│    - Pension Package (REQUIRED)                                  │
│    - Review                                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Admin clicks "Proceed to Payment"                            │
│    - Validates pension package is selected                      │
│    - Calculates total: Membership Fee + First Month             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Frontend submits to backend                                  │
│    POST /api/v1/admin/members/create                            │
│    { ...memberData, payment_method: "bkash" }                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Backend creates member and initiates payment                 │
│    - Creates member record (status: pending_payment)            │
│    - Creates payment record                                     │
│    - Initiates bKash payment                                    │
│    - Returns member data + bkashURL                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Frontend redirects to bKash                                  │
│    window.location.href = bkashURL                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Admin completes payment on bKash                             │
│    - Enters bKash PIN                                           │
│    - Confirms payment                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. bKash redirects back to callback URL                         │
│    /payment/bkash/callback?status=success                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Callback page confirms payment with backend                  │
│    POST /api/v1/admin/members/payment-success                   │
│    { payment_id, gateway_transaction_id }                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. Backend verifies and updates                                 │
│    - Verifies payment with bKash                                │
│    - Updates member status to "active"                          │
│    - Updates payment status to "completed"                      │
│    - Creates wallet transaction                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. Admin redirected to success page                            │
│     - Shows success message                                     │
│     - Option to view member profile                             │
│     - Option to create another member                           │
└─────────────────────────────────────────────────────────────────┘
```

## UI Changes

### Pension Step
**Before:**
- Skip option available
- Optional pension selection
- Message: "Choose a package or skip for now"

**After:**
- No skip option
- Mandatory pension selection
- Message: "Select a pension package (Required)"
- Warning: "Admin must select a pension package. Payment via bKash is required for the first month."
- Disabled "Next" button until package is selected
- Validation error message if trying to proceed without selection

### Review Step
**Before:**
- Simple "Create Member" button
- No payment information
- No payment flow

**After:**
- Payment summary section showing:
  - Membership Fee: ৳400
  - Pension Package: [Package Name] (৳[Amount])
  - Total Due Today: ৳[Total]
- "Proceed to Payment" button
- Loading state during submission
- Payment modal for fallback scenarios
- Redirect to bKash payment gateway

## Payment Modal

The payment modal appears as a fallback if:
- Payment URL is not returned from backend
- Payment window fails to open
- User needs instructions

**Modal Features:**
- Success message confirming member creation
- Payment instructions
- Payment summary
- Link to retry payment from member profile
- Link to go to members list

## Error Handling

### Validation Errors
- Pension package not selected: Toast error message
- Form validation errors: Displayed inline

### API Errors
- Network errors: Toast error with message
- Backend validation errors: Toast error with backend message
- Payment initiation errors: Toast error + fallback modal

### Payment Errors
- Payment URL not available: Show payment modal with retry option
- Payment failed: Redirect to failure page with retry option
- Payment cancelled: Redirect to member profile with retry option

## Backend Requirements

### New Endpoint Required
**Endpoint:** `POST /api/v1/admin/members/create`

**Authentication:** Required (Admin role)

**Request:** `multipart/form-data`

**Response:**
```json
{
  "success": true,
  "message": "Member created successfully. Please complete payment.",
  "data": {
    "member": {
      "id": 123,
      "member_id": "EXP-2024-00123",
      "name_english": "John Doe",
      "email": "john@example.com",
      "mobile": "01712345678",
      "status": "pending_payment"
    },
    "payment": {
      "payment_id": 456,
      "amount": 1400,
      "payment_method": "bkash",
      "status": "pending",
      "bkashURL": "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create/..."
    }
  }
}
```

### Backend Implementation Steps

1. **Validate Request**
   - Check all required fields
   - Validate pension package exists and is active
   - Validate sponsor if provided
   - Validate file uploads

2. **Create Member**
   - Create user account (status: pending_payment)
   - Store member information
   - Upload and store files
   - Create nominee records

3. **Calculate Payment Amount**
   - Membership fee: ৳400
   - First month pension: Get from pension package
   - Total: Membership fee + First month

4. **Initiate bKash Payment**
   - Create payment record
   - Call bKash API to create payment
   - Get payment URL
   - Store payment details

5. **Return Response**
   - Return member data
   - Return payment data with bkashURL

6. **Handle Payment Callback**
   - Verify payment with bKash
   - Update member status to "active"
   - Update payment status to "completed"
   - Create wallet transaction
   - Send confirmation email/SMS

## Testing Checklist

### Pension Step
- [ ] Skip option is not visible
- [ ] Cannot proceed without selecting a package
- [ ] "Next" button is disabled when no package selected
- [ ] Validation message appears when trying to proceed without selection
- [ ] Can select a pension package
- [ ] Selected package is highlighted
- [ ] Can change selected package
- [ ] "Next" button is enabled after selection

### Review Step
- [ ] All member information is displayed correctly
- [ ] Payment summary shows correct amounts
- [ ] Membership fee is ৳400
- [ ] Pension package amount is correct
- [ ] Total due is calculated correctly
- [ ] "Proceed to Payment" button is visible
- [ ] Loading state appears during submission
- [ ] Success toast appears on successful submission
- [ ] Error toast appears on failed submission

### Payment Flow
- [ ] Backend creates member successfully
- [ ] Backend returns payment URL
- [ ] Frontend redirects to bKash payment gateway
- [ ] Payment modal appears if URL is not available
- [ ] Can retry payment from modal
- [ ] Can navigate to member profile from modal
- [ ] Can navigate to members list from modal

### Payment Callback
- [ ] Payment success callback updates member status
- [ ] Payment failure callback keeps member in pending state
- [ ] Payment cancelled allows retry
- [ ] Success page shows correct information
- [ ] Can view member profile after payment
- [ ] Can create another member after payment

## Security Considerations

1. **Authentication**
   - Only authenticated admins can create members
   - Verify admin role before processing

2. **Payment Security**
   - Payment amount calculated on backend
   - Cannot manipulate payment amount from frontend
   - Payment verification with bKash before updating status

3. **Data Validation**
   - Validate all input data on backend
   - Sanitize file uploads
   - Validate file types and sizes

4. **Error Handling**
   - Don't expose sensitive error details
   - Log errors for debugging
   - Show user-friendly error messages

## Future Enhancements

1. **Payment Options**
   - Add SSLCommerz as alternative payment method
   - Add manual payment option for cash/bank transfer

2. **Bulk Import**
   - Import multiple members from CSV/Excel
   - Batch payment processing

3. **Payment Retry**
   - Automatic retry for failed payments
   - Payment reminder notifications

4. **Reporting**
   - Payment success/failure reports
   - Member creation analytics
   - Payment reconciliation reports

## Troubleshooting

### Issue: Payment URL not returned
**Solution:** Check backend logs, ensure bKash API is configured correctly

### Issue: Payment fails after redirect
**Solution:** Check bKash callback URL configuration, verify payment verification logic

### Issue: Member created but payment not recorded
**Solution:** Check payment callback handler, ensure payment status is updated correctly

### Issue: Cannot select pension package
**Solution:** Check if pension packages are loaded, verify API endpoint is working

## Conclusion

The admin membership feature now requires pension package selection and bKash payment integration. This ensures all admin-created members have a pension package and payment is processed immediately, maintaining data consistency and financial tracking.

## Related Documentation

- `ADMIN_MEMBERSHIP_IMPLEMENTATION.md` - Original admin membership implementation
- `MEMBERSHIP_PAYMENT_INTEGRATION.md` - Public membership payment flow
- `BKASH_CALLBACK_CONFIGURATION.md` - bKash payment callback setup
- `FRONTEND_API_DOCUMENTATION.md` - API endpoints documentation
