# Pension Role Application - Frontend Implementation

## 🎯 Overview

Complete frontend implementation for the Pension Role Application system, allowing members to apply for advanced roles (Executive Member, Project Presenter, Assistant PP) and admins to review and approve/reject applications.

---

## 📁 Files Created

### 1. API Functions
**File:** `lib/api/functions/user/pensionRoleApplicationApi.ts`

Contains all API calls for both member and admin operations:

#### Member APIs:
- `getAvailableRoles()` - Check which roles member can apply for
- `submitRoleApplication()` - Submit new application with documents
- `getMyApplications()` - List all my applications
- `getApplicationDetails()` - View specific application
- `cancelApplication()` - Cancel pending application
- `getMyApplicationStats()` - Get application statistics
- `initiateApplicationPayment()` - Start payment process for Executive Member

#### Admin APIs:
- `getAllApplications()` - List all applications with filters
- `getAdminApplicationDetails()` - View application details
- `approveApplication()` - Approve and assign role
- `rejectApplication()` - Reject with reason
- `getApplicationStats()` - Get comprehensive statistics
- `bulkApproveApplications()` - Approve multiple applications
- `bulkRejectApplications()` - Reject multiple applications

---

### 2. React Hooks
**File:** `lib/hooks/user/usePensionRoleApplications.ts`

Custom React Query hooks for data fetching and mutations:

#### Member Hooks:
- `useAvailableRoles()` - Fetch available roles
- `useSubmitRoleApplication()` - Submit application mutation
- `useMyApplications()` - Fetch my applications
- `useApplicationDetails()` - Fetch application details
- `useCancelApplication()` - Cancel application mutation
- `useMyApplicationStats()` - Fetch my statistics
- `useInitiateApplicationPayment()` - Initiate payment mutation

#### Admin Hooks:
- `useAllApplications()` - Fetch all applications with filters
- `useAdminApplicationDetails()` - Fetch application details
- `useApproveApplication()` - Approve application mutation
- `useRejectApplication()` - Reject application mutation
- `useApplicationStats()` - Fetch statistics
- `useBulkApproveApplications()` - Bulk approve mutation
- `useBulkRejectApplications()` - Bulk reject mutation

---

### 3. User Dashboard Page
**File:** `app/(auth)/dashboard/role-application/page.tsx`

Member-facing page for applying for roles.

#### Features:
- ✅ Display current role and enrollment info
- ✅ Show available roles with descriptions and fees
- ✅ Application form with reason and document upload
- ✅ File upload support (PDF, JPG, JPEG, PNG)
- ✅ View all my applications with status
- ✅ Cancel pending applications
- ✅ Payment integration for Executive Member
- ✅ Application statistics dashboard
- ✅ Real-time status updates

#### UI Components:
- Current role card with gradient background
- Statistics cards (Total, Under Review, Approved, Payment Pending)
- Available roles grid with payment indicators
- Application form with file upload
- My applications sidebar with status badges
- Cancel application confirmation

---

### 4. Admin Management Page
**File:** `app/(auth)/admin/pension-role-applications/page.tsx`

Admin page for reviewing and managing all applications.

#### Features:
- ✅ Comprehensive statistics dashboard
- ✅ Advanced filtering (status, role, search)
- ✅ Sortable applications table
- ✅ Approve/Reject actions with modals
- ✅ View detailed application information
- ✅ Payment status verification
- ✅ Bulk operations support
- ✅ Pagination
- ✅ Real-time updates

#### UI Components:
- Statistics cards (Total, Payment Pending, Under Review, Approved, Rejected)
- Filter bar (search, status, role)
- Applications table with actions
- Approve modal with review notes
- Reject modal with rejection reason
- View details modal
- Status badges with icons
- Payment status indicators

---

### 5. Navigation Updates

#### User Sidebar
**File:** `components/admin/user-sidebar-items.tsx`

Added new menu item:
```typescript
{ name: "Apply for Role", href: "/dashboard/role-application", icon: Award }
```

#### Admin Sidebar
**File:** `components/admin/sidebar-items.tsx`

Added new menu item:
```typescript
{ name: "Role Applications", href: "/admin/pension-role-applications", icon: Award }
```

---

## 🎨 UI/UX Features

### Design System
- **Colors:**
  - Green: Primary actions, approved status
  - Amber: Payment pending, warnings
  - Blue: Under review, info
  - Red: Rejected, cancel actions
  - Gray: Neutral, cancelled status

- **Icons:**
  - CheckCircle2: Approved
  - X: Rejected
  - Clock: Under review
  - CreditCard: Payment pending
  - Award: Roles
  - Upload: File upload
  - Loader2: Loading states

### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Sticky sidebar on desktop
- Modal overlays for actions
- Touch-friendly buttons

### User Feedback
- Toast notifications for all actions
- Loading states with spinners
- Disabled states for pending actions
- Confirmation dialogs for destructive actions
- Real-time status updates

---

## 🔄 User Flow

### Member Application Flow

1. **Navigate to Apply for Role**
   - Click "Apply for Role" in sidebar
   - View current role and available roles

2. **Select Role**
   - Click on desired role card
   - View role description and fee (if applicable)
   - Application form appears

3. **Fill Application**
   - Enter application reason (required)
   - Upload supporting documents (optional)
   - Review information

4. **Submit Application**
   - Click "Submit Application"
   - See success message
   - Application appears in "My Applications"

5. **Payment (Executive Member Only)**
   - Status: "Payment Pending"
   - Click "Pay Now" button
   - Redirected to bKash payment
   - Complete payment
   - Status changes to "Under Review"

6. **Wait for Review**
   - Admin reviews application
   - Member receives notification
   - Status updates to "Approved" or "Rejected"

7. **Role Assigned**
   - If approved, role automatically assigned
   - Member can see new role in profile
   - Access to role-specific features

---

### Admin Review Flow

1. **Navigate to Role Applications**
   - Click "Role Applications" in admin sidebar
   - View statistics dashboard

2. **Filter Applications**
   - Use search bar for specific member
   - Filter by status (Payment Pending, Under Review, etc.)
   - Filter by role type

3. **Review Application**
   - Click "View Details" icon
   - Review member information
   - Check application reason
   - Verify payment status (if required)

4. **Make Decision**
   
   **Option A: Approve**
   - Click green checkmark icon
   - Add review notes (optional)
   - Click "Approve"
   - Role automatically assigned to member
   - Member notified

   **Option B: Reject**
   - Click red X icon
   - Enter rejection reason (required)
   - Add additional notes (optional)
   - Click "Reject"
   - Member notified with reason

5. **Bulk Operations** (Optional)
   - Select multiple applications
   - Click "Bulk Approve" or "Bulk Reject"
   - Add notes/reasons
   - Confirm action

---

## 💰 Payment Integration

### Executive Member Payment (60,000 TK)

1. **Application Submitted**
   - Status: `payment_pending`
   - Payment required: Yes
   - Amount: 60,000 TK

2. **Initiate Payment**
   - Member clicks "Pay Now"
   - API call: `POST /pension-role-applications/{id}/initiate-payment`
   - Payment record created

3. **bKash Payment**
   - API call: `POST /bkash/create-payment`
   - Member redirected to bKash
   - Completes payment with mobile number & PIN

4. **Automatic Processing**
   - bKash callback received
   - Payment status: `completed`
   - Application status: `under_review`
   - Wallet transaction created
   - Activity logged

5. **Admin Approval**
   - Admin reviews paid application
   - Approves application
   - Role assigned automatically

---

## 📊 Status Flow

### Application Statuses

```
EXECUTIVE MEMBER:
payment_pending → (payment) → under_review → (admin) → approved/rejected

OTHER ROLES (PP, APP):
under_review → (admin) → approved/rejected

CANCELLED:
Any status → (member cancels) → cancelled
```

### Status Descriptions

| Status | Description | Actions Available |
|--------|-------------|-------------------|
| `payment_pending` | Awaiting payment | Pay Now, Cancel |
| `under_review` | Ready for admin review | Cancel (member), Approve/Reject (admin) |
| `approved` | Approved and role assigned | View only |
| `rejected` | Rejected by admin | View only |
| `cancelled` | Cancelled by member | View only |

---

## 🔐 Permissions

### Member Permissions
- ✅ View available roles
- ✅ Submit applications
- ✅ View own applications
- ✅ Cancel pending applications
- ✅ Initiate payments
- ❌ View other members' applications
- ❌ Approve/reject applications

### Admin Permissions
- ✅ View all applications
- ✅ Filter and search applications
- ✅ View application details
- ✅ Approve applications
- ✅ Reject applications
- ✅ Bulk approve/reject
- ✅ View statistics
- ❌ Submit applications (admin role)

---

## 🧪 Testing Checklist

### Member Testing
- [ ] Can view available roles
- [ ] Can submit application with documents
- [ ] Can view application status
- [ ] Can cancel pending application
- [ ] Payment flow works for Executive Member
- [ ] Cannot apply for same role twice
- [ ] File upload works correctly
- [ ] Statistics display correctly

### Admin Testing
- [ ] Can view all applications
- [ ] Filters work correctly
- [ ] Search works correctly
- [ ] Can approve applications
- [ ] Can reject applications
- [ ] Cannot approve without payment (Executive Member)
- [ ] Role assigned after approval
- [ ] Bulk operations work
- [ ] Statistics accurate

---

## 🚀 Deployment Checklist

- [ ] API endpoints configured correctly
- [ ] Environment variables set
- [ ] File upload storage configured
- [ ] bKash payment gateway configured
- [ ] Database migrations run
- [ ] Permissions configured
- [ ] Navigation links added
- [ ] Toast notifications working
- [ ] Loading states implemented
- [ ] Error handling in place

---

## 📱 Responsive Breakpoints

```css
Mobile: < 768px
- Single column layout
- Stacked cards
- Full-width modals

Tablet: 768px - 1024px
- Two column layout
- Side-by-side cards
- Larger modals

Desktop: > 1024px
- Three column layout
- Sticky sidebar
- Full-width table
```

---

## 🎯 Key Features Summary

### Member Features
1. ✅ View current role and available roles
2. ✅ Submit applications with documents
3. ✅ Track application status
4. ✅ Cancel pending applications
5. ✅ Pay for Executive Member role via bKash
6. ✅ View application history
7. ✅ Real-time status updates

### Admin Features
1. ✅ View all applications with filters
2. ✅ Search by member or application number
3. ✅ Approve applications (auto-assign role)
4. ✅ Reject applications with reason
5. ✅ Verify payment status
6. ✅ Bulk approve/reject
7. ✅ Comprehensive statistics
8. ✅ View detailed application info

---

## 🔗 Related Documentation

- [PENSION_ROLE_APIS_COMPLETE.md](./PENSION_ROLE_APIS_COMPLETE.md) - Complete API documentation
- [PENSION_ROLE_PAYMENT_INTEGRATION.md](./PENSION_ROLE_PAYMENT_INTEGRATION.md) - Payment flow details
- [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md) - General API docs

---

## 💡 Tips for Developers

1. **Always check payment status** before approving Executive Member applications
2. **Use React Query hooks** for automatic caching and refetching
3. **Handle loading states** to prevent duplicate submissions
4. **Show clear error messages** to users
5. **Validate file uploads** on client side before submission
6. **Use toast notifications** for all user actions
7. **Implement proper error boundaries** for production
8. **Test payment flow** in sandbox environment first

---

## 🐛 Common Issues & Solutions

### Issue: Application not submitting
**Solution:** Check if pension enrollment exists and is active

### Issue: Payment button not showing
**Solution:** Verify payment_required flag and payment_completed status

### Issue: Cannot approve application
**Solution:** Check if status is "under_review" and payment completed (if required)

### Issue: File upload failing
**Solution:** Check file size (max 5MB) and format (PDF, JPG, JPEG, PNG)

### Issue: Statistics not updating
**Solution:** Invalidate React Query cache after mutations

---

## ✅ Implementation Complete!

All frontend components for the Pension Role Application system are now implemented and ready to use. Members can apply for roles through the user dashboard, and admins can review and manage applications through the admin panel.

**Next Steps:**
1. Test the complete flow end-to-end
2. Configure bKash payment gateway
3. Set up file storage for documents
4. Deploy to production
5. Train users on the new system

---

**Created:** April 15, 2026
**Last Updated:** April 15, 2026
**Version:** 1.0.0
