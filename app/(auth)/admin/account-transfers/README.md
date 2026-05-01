# Account Transfers Admin Interface

## Overview
This admin interface manages pension account transfer requests from existing members to new members. The system has been redesigned with a **simplified, automated flow** that reduces manual steps and speeds up the transfer process.

## 🆕 NEW FLOW (Simplified)

### **What Changed?**
The transfer process has been streamlined from **6 steps to 3 steps**:

**OLD FLOW** (6 steps, ~30 minutes):
1. Member requests transfer
2. Admin reviews
3. Admin approves
4. **New member registers manually**
5. **Admin completes transfer**
6. Done

**NEW FLOW** (3 steps, ~5 minutes):
1. Member requests transfer (with complete info + nominees)
2. Admin reviews
3. **Admin approves → Everything happens automatically!**
   - ✅ New user created
   - ✅ Member profile created
   - ✅ Nominees created
   - ✅ Wallet created
   - ✅ Wallet balance transferred
   - ✅ Pension enrollment transferred
   - ✅ Temporary password sent
   - ✅ Transfer completed

## Features Implemented

### 1. Main Dashboard (`page.tsx`)
- **Statistics Overview**: Total transfers, under review, completed, and total fees collected
- **Advanced Filtering**: 
  - Search by transfer number, member name, or email
  - Filter by status (requested, under_review, approved, rejected, completed, cancelled)
  - Filter by outstanding balance status
  - Filter by new member registration status
- **Comprehensive Table View**: Shows all transfer details at a glance
- **Action Buttons**: Context-aware actions based on transfer status
- **Pagination**: Efficient navigation through large datasets

### 2. Transfer Details Modal (`TransferDetailsModal.tsx`)
- Complete transfer information display
- Status timeline with timestamps
- From member and new member details
- **NEW**: Complete address information (present + permanent)
- **NEW**: Family information (father, mother, religion)
- **NEW**: Nominee information with percentages
- Pension enrollment information
- Financial details (outstanding balance, transfer fee)
- Transfer reason and details
- Supporting documents with download links
- Review notes and reviewer information

### 3. Review Modal (`ReviewModal.tsx`)
- Move transfer from "requested" to "under_review" status
- Add optional review notes
- Transfer summary for quick reference

### 4. Approve Modal (`ApproveModal.tsx`)
- **UPDATED**: Now shows auto-complete information
- Approve transfers that meet all requirements
- Validates:
  - Transfer is in "under_review" status
  - Outstanding balance is cleared
- **NEW**: Automatically creates everything on approval:
  - New user account with temporary password
  - Member profile with all information
  - All nominees
  - Wallet with transferred balance
  - Transfers pension enrollment
  - Completes transfer immediately
- Sends credentials to new member via email

### 5. Reject Modal (`RejectModal.tsx`)
- Reject transfers with mandatory reason
- Notifies member with rejection details
- Transfer summary for context

### 6. Clear Outstanding Modal (`ClearOutstandingModal.tsx`)
- Mark outstanding balance as cleared
- Add payment notes (method, transaction ID, etc.)
- Required before approval

## Workflow

### Step 1: Request Received
- Member submits transfer request with:
  - Complete new member information
  - Address details (present + permanent)
  - Family information (father, mother, religion)
  - **At least 1 nominee** (with percentages totaling 100%)
  - Supporting documents
- Status: `requested`
- Admin can view details and move to review

### Step 2: Under Review
- Admin reviews documents and validates information
- Status: `under_review`
- Admin can:
  - Clear outstanding balance
  - Approve (if outstanding cleared) → **Auto-completes everything!**
  - Reject

### Step 3: Completed (Automatic!)
- When admin approves, the system automatically:
  1. Generates temporary password (format: EWF123456)
  2. Creates new user account
  3. Creates member profile with all information
  4. Creates all nominee records
  5. Creates wallet
  6. Transfers wallet balance from old to new member
  7. Transfers pension enrollment ownership
  8. Marks transfer as completed
  9. Sends credentials to new member
- Status: `completed`
- **IRREVERSIBLE**

## Business Rules Enforced

### Transfer Eligibility
1. Member must own the pension enrollment
2. Enrollment must be active (not matured, not cancelled)
3. No pending transfer requests for same enrollment
4. New member email, phone, and NID must be unique
5. **NEW**: At least 1 nominee required
6. **NEW**: Nominee percentages must total 100%

### Approval Requirements
1. Status must be "under_review"
2. Outstanding balance must be cleared
3. All documents must be verified
4. **NEW**: Complete new member information (including nominees)

### Auto-Completion on Approval
When admin approves, the system automatically:
1. Creates user account (email verified, active status)
2. Generates member ID (format: EWF-000XXX)
3. Creates member profile with all data
4. Creates all nominees with photos
5. Creates wallet
6. Transfers wallet balance (creates transactions for both users)
7. Transfers pension enrollment
8. Sends temporary password to new member
9. Marks transfer as completed

## Transfer Fees
- **Calculation**: 2% of total amount paid
- **Minimum**: ৳500
- **Examples**:
  - Total paid: ৳10,000 → Fee: ৳500 (minimum)
  - Total paid: ৳50,000 → Fee: ৳1,000 (2%)
  - Total paid: ৳100,000 → Fee: ৳2,000 (2%)

## Wallet Transfer
When transfer is approved and completed:
- Old member's wallet balance → ৳0
- New member's wallet balance → receives full amount
- Transaction records created for both users
- Reference to account transfer maintained

## API Endpoints Used

### Admin Endpoints
- `GET /api/v1/admin/account-transfers` - List all transfers
- `GET /api/v1/admin/account-transfers/statistics` - Get statistics
- `GET /api/v1/admin/account-transfer/{id}` - View details
- `PUT /api/v1/admin/account-transfer/{id}/review` - Move to review
- `PUT /api/v1/admin/account-transfer/{id}/approve` - **Approve & Auto-Complete**
- `PUT /api/v1/admin/account-transfer/{id}/reject` - Reject
- `PUT /api/v1/admin/account-transfer/{id}/clear-outstanding` - Clear outstanding
- ~~`PUT /api/v1/admin/account-transfer/{id}/complete`~~ - **REMOVED** (auto-completes on approval)

## Hooks Created

### 1. Account Transfer Approval Hook
- **Trigger**: Before approving a transfer
- **Validates**:
  - Transfer is in 'under_review' status
  - Outstanding balance is cleared
  - All documents are verified
  - New member data is validated
  - Nominee information is complete
- **NEW**: Warns that approval will auto-complete everything

### 2. ~~Account Transfer Completion Hook~~ (REMOVED)
- No longer needed - completion happens automatically on approval

### 3. Account Transfer Review Hook
- **Trigger**: Before moving to review
- **Validates**:
  - Transfer is in 'requested' status
  - All required documents are uploaded
  - New member information is complete
  - **NEW**: Nominee information is complete

### 4. Account Transfer Outstanding Clear Hook
- **Trigger**: Before clearing outstanding balance
- **Validates**:
  - Payment has been received
  - Payment details are documented
  - Amount matches outstanding balance

## React Query Hooks

### Data Fetching
- `useAccountTransfers(params)` - Fetch paginated transfers
- `useAccountTransfer(id)` - Fetch single transfer
- `useAccountTransferStatistics()` - Fetch statistics

### Mutations
- `useReviewTransfer()` - Move to review
- `useApproveTransfer()` - **Approve & Auto-Complete**
- `useRejectTransfer()` - Reject transfer
- `useClearOutstanding()` - Clear outstanding balance
- ~~`useCompleteTransfer()`~~ - **REMOVED** (auto-completes on approval)

## Status Badge Colors
- **Requested**: Blue
- **Under Review**: Yellow
- ~~**Approved**: Green~~ (No longer used - goes directly to completed)
- **Rejected**: Red
- **Completed**: Purple (Auto-completed on approval)
- **Cancelled**: Gray

## New Member Data Structure

### Required Fields
- Name, email, phone, NID
- Date of birth, gender
- Present address (required)
- Permanent address (optional, defaults to present)

### Optional Fields
- Father's name
- Mother's name
- Religion
- Photo

### Nominees (Required)
- At least 1 nominee required
- Each nominee has:
  - Name, relation, phone (required)
  - NID, date of birth, address (optional)
  - Percentage (required, must total 100%)
  - Photo (optional)

## Security Considerations
1. All endpoints require authentication
2. Admin role required for all actions
3. Outstanding balance must be cleared before approval
4. **NEW**: Temporary password sent securely via email
5. **NEW**: Email auto-verified on account creation
6. Transfer completion is irreversible
7. Wallet transactions are atomic

## Future Enhancements
1. Email notifications at each stage
2. Document verification checklist
3. Transfer history tracking
4. Bulk actions for multiple transfers
5. Export to CSV/PDF
6. Advanced analytics dashboard
7. Automated outstanding balance calculation
8. Integration with payment gateway
9. SMS notifications for temporary password

## Testing Checklist
- [ ] View all transfers with different filters
- [ ] View transfer details with nominees
- [ ] Move transfer to review
- [ ] Clear outstanding balance
- [ ] Approve transfer (verify auto-completion)
- [ ] Verify new user account created
- [ ] Verify member profile created with all data
- [ ] Verify nominees created
- [ ] Verify wallet created and balance transferred
- [ ] Verify pension enrollment transferred
- [ ] Verify temporary password sent
- [ ] Reject transfer
- [ ] Verify status transitions
- [ ] Test pagination
- [ ] Test search functionality
- [ ] Verify hooks are triggered correctly

## Support
For issues or questions, contact the development team or refer to:
- `ACCOUNT_TRANSFER_NEW_FLOW.md` - New flow documentation
- `ACCOUNT_TRANSFER_IMPLEMENTATION_COMPLETE.md` - Backend implementation
- `lib/hooks/admin/useAccountTransfers.ts` - React Query hooks
- API documentation at `/api/documentation`
