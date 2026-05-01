# Member Account Transfers Dashboard

## Overview
This is the member-facing interface for requesting and managing pension account transfers. Members can transfer their pension accounts to new members (not existing members) through a guided multi-step process.

## Features Implemented

### 1. Main Dashboard (`page.tsx`)
- **Two Tabs**:
  - **My Requests**: Transfers initiated by the current member
  - **Received Transfers**: Transfers where current member is the new member
- **Statistics Cards**: Total, Pending, Approved, Completed
- **Transfer List**: Shows all transfers with key information
- **Status Badges**: Visual indicators for each transfer status
- **Quick Actions**: View details, cancel (if applicable)

### 2. Request Transfer Modal (`RequestTransferModal.tsx`)
**3-Step Wizard Process**:

#### Step 1: Select Enrollment
- Lists all active pension enrollments
- Shows eligibility check for selected enrollment
- Displays outstanding balance and transfer fee
- Validates enrollment can be transferred

#### Step 2: New Member Information
- **Transfer Reason**: Select from predefined reasons
- **Reason Details**: Detailed explanation
- **New Member Data**:
  - Full Name
  - Email (must be unique)
  - Phone (must be unique)
  - NID (must be unique)
  - Date of Birth
  - Gender
  - Address
  - Photo (optional)

#### Step 3: Review & Submit
- Summary of all entered information
- Upload supporting documents (optional)
- Final submission

### 3. Transfer Details Modal (`TransferDetailsModal.tsx`)
- Complete transfer information
- Current status with timeline
- Pension enrollment details
- New member information
- Financial details (outstanding, fee)
- Transfer reason and details
- Supporting documents with download links
- Admin review notes
- Cancel button (for pending transfers)

## User Flow

### Requesting a Transfer

```
1. Member clicks "Request Transfer"
   ↓
2. Step 1: Select pension enrollment
   - System checks eligibility
   - Shows outstanding balance & fee
   ↓
3. Step 2: Enter new member information
   - Fill transfer reason
   - Enter new member details
   - Upload photo (optional)
   ↓
4. Step 3: Review and submit
   - Review all information
   - Upload documents (optional)
   - Submit request
   ↓
5. Request submitted
   - Status: "requested"
   - Admin receives notification
```

### After Submission

```
Status: REQUESTED
↓
Admin reviews → Status: UNDER_REVIEW
↓
Admin clears outstanding balance
↓
Admin approves → Status: APPROVED
↓
New member receives email with registration link
↓
New member registers → new_member_registered = true
↓
Admin completes transfer → Status: COMPLETED
↓
Pension ownership transferred
```

## API Endpoints Used

### Member Endpoints
- `GET /api/v1/account-transfers/my-requests` - Get my transfer requests
- `GET /api/v1/account-transfers/my-received` - Get received transfers
- `GET /api/v1/account-transfer/{id}` - Get transfer details
- `POST /api/v1/account-transfers/request` - Request new transfer
- `PUT /api/v1/account-transfer/{id}/cancel` - Cancel transfer
- `POST /api/v1/account-transfer/{id}/upload-document` - Upload document
- `GET /api/v1/pension-enrollment/{id}/transfer-eligibility` - Check eligibility

## React Query Hooks

### Data Fetching
- `useMyTransferRequests()` - Fetch my transfer requests
- `useReceivedTransfers()` - Fetch received transfers
- `useTransfer(id)` - Fetch single transfer
- `useTransferEligibility(enrollmentId)` - Check eligibility

### Mutations
- `useRequestTransfer()` - Submit transfer request
- `useCancelTransfer()` - Cancel transfer
- `useUploadDocument()` - Upload additional document

## Transfer Eligibility Rules

A pension enrollment is eligible for transfer if:
1. ✅ Member owns the enrollment
2. ✅ Enrollment is active (not matured, not cancelled)
3. ✅ No pending transfer requests for same enrollment
4. ✅ Enrollment has not been transferred before
5. ✅ New member email, phone, and NID are unique

## Transfer Fees

- **Calculation**: 2% of total amount paid
- **Minimum**: ৳500
- **Examples**:
  - Total paid: ৳10,000 → Fee: ৳500 (minimum)
  - Total paid: ৳50,000 → Fee: ৳1,000 (2%)
  - Total paid: ৳100,000 → Fee: ৳2,000 (2%)

## Status Meanings

### For Members

| Status | Meaning | Actions Available |
|--------|---------|-------------------|
| **Requested** | Transfer request submitted, waiting for admin review | View Details, Cancel |
| **Under Review** | Admin is reviewing the request | View Details, Cancel |
| **Approved** | Transfer approved, waiting for new member registration | View Details |
| **Rejected** | Transfer rejected by admin (see review notes) | View Details |
| **Completed** | Transfer completed, ownership transferred | View Details |
| **Cancelled** | Transfer cancelled by member | View Details |

## Status-Specific Messages

### Approved (Waiting for Registration)
```
"Your transfer has been approved! The new member will receive 
an email with registration instructions. Once they complete 
registration, the admin will finalize the transfer."
```

### Rejected
```
"Rejection Reason: [Admin's notes]"
```

### Completed
```
"This transfer has been successfully completed. The pension 
account has been transferred to [New Member Name]."
```

## File Upload Specifications

### New Member Photo
- **Accepted**: JPG, JPEG, PNG
- **Max Size**: 5MB
- **Optional**: Yes

### Supporting Documents
- **Accepted**: PDF, JPG, JPEG, PNG
- **Max Size**: 5MB per file
- **Multiple**: Yes
- **Optional**: Yes

## UI Components

### Status Badge Colors
- **Requested**: Blue
- **Under Review**: Yellow
- **Approved**: Green
- **Rejected**: Red
- **Completed**: Purple
- **Cancelled**: Gray

### Info Cards
- Total Requests (Blue)
- Pending (Yellow)
- Approved (Green)
- Completed (Purple)

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (4-column grid)

### Mobile Optimizations
- Full-width modals
- Stacked form fields
- Touch-friendly buttons
- Scrollable content areas

## Error Handling

### Common Errors

**"Email already registered"**
- New member email must be unique
- Check if email exists in system

**"Phone already registered"**
- New member phone must be unique
- Use different phone number

**"NID already registered"**
- New member NID must be unique
- Verify NID is correct

**"Enrollment not eligible"**
- Check eligibility reasons
- Resolve issues before resubmitting

**"Cannot cancel transfer"**
- Only requested/under_review can be cancelled
- Contact admin for other statuses

## Security Considerations

1. **Authentication Required**: All endpoints require valid auth token
2. **Ownership Validation**: Can only access own transfers
3. **Unique Validation**: Email, phone, NID must be unique
4. **File Validation**: File type and size validated
5. **Status Validation**: Actions restricted by status

## Future Enhancements

1. **Real-time Updates**: WebSocket for status changes
2. **Email Notifications**: Notify at each status change
3. **Document Preview**: Preview documents before upload
4. **Transfer History**: View all past transfers
5. **Bulk Upload**: Upload multiple documents at once
6. **Progress Tracking**: Visual timeline of transfer progress
7. **Chat Support**: Direct chat with admin
8. **Mobile App**: Native mobile application

## Testing Checklist

- [ ] View my transfer requests
- [ ] View received transfers
- [ ] Request new transfer (all 3 steps)
- [ ] Check enrollment eligibility
- [ ] Upload new member photo
- [ ] Upload supporting documents
- [ ] View transfer details
- [ ] Cancel pending transfer
- [ ] Try to cancel completed transfer (should fail)
- [ ] Submit with duplicate email (should fail)
- [ ] Submit with duplicate phone (should fail)
- [ ] Submit with duplicate NID (should fail)
- [ ] Test responsive design on mobile
- [ ] Test form validation
- [ ] Test file upload validation

## Integration with Admin Side

### Member Submits Request
```
Member Dashboard → Request Transfer → Submit
↓
Backend creates transfer record
↓
Admin Dashboard → New transfer appears
↓
Admin reviews and processes
```

### Admin Approves
```
Admin Dashboard → Approve Transfer
↓
Backend updates status to "approved"
↓
Member Dashboard → Status updates to "Approved"
↓
New member receives email
```

### New Member Registers
```
New Member → Clicks email link → Registers
↓
Backend sets new_member_registered = true
↓
Member Dashboard → Shows "✓ Registered"
↓
Admin Dashboard → "Complete Transfer" button enabled
```

### Admin Completes
```
Admin Dashboard → Complete Transfer
↓
Backend transfers ownership
↓
Member Dashboard → Status updates to "Completed"
```

## Support

For issues or questions:
- Check transfer status in dashboard
- View admin review notes for guidance
- Contact admin through support channels
- Refer to API documentation for technical details

---

**Implementation Date:** April 25, 2026  
**Status:** ✅ Complete and Ready for Testing  
**Related**: Admin interface at `/admin/account-transfers`
