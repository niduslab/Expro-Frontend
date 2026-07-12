# Pension Role Application - System Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   Member Dashboard   │         │    Admin Panel       │     │
│  │                      │         │                      │     │
│  │  - Apply for Role    │         │  - View Applications │     │
│  │  - View Status       │         │  - Approve/Reject    │     │
│  │  - Make Payment      │         │  - Verify Payment    │     │
│  │  - Cancel App        │         │  - Bulk Operations   │     │
│  └──────────────────────┘         └──────────────────────┘     │
│           │                                   │                  │
│           └───────────────┬───────────────────┘                  │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────┐           │
│  │         React Query Hooks Layer                  │           │
│  │  - useAvailableRoles()                          │           │
│  │  - useSubmitRoleApplication()                   │           │
│  │  - useApproveApplication()                      │           │
│  │  - useRejectApplication()                       │           │
│  └────────────────────────┬────────────────────────┘           │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────┐           │
│  │            API Functions Layer                   │           │
│  │  - pensionRoleApplicationApi.ts                 │           │
│  │  - 15 API functions                             │           │
│  └────────────────────────┬────────────────────────┘           │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    BACKEND API (Laravel)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   Member Routes      │         │    Admin Routes      │     │
│  │                      │         │                      │     │
│  │  GET  /available-    │         │  GET  /admin/        │     │
│  │       roles          │         │       applications   │     │
│  │  POST /applications  │         │  POST /admin/        │     │
│  │  GET  /applications  │         │       approve        │     │
│  │  POST /cancel        │         │  POST /admin/        │     │
│  │  POST /initiate-     │         │       reject         │     │
│  │       payment        │         │  POST /admin/        │     │
│  │                      │         │       bulk-approve   │     │
│  └──────────────────────┘         └──────────────────────┘     │
│           │                                   │                  │
│           └───────────────┬───────────────────┘                  │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────┐           │
│  │              Controllers                         │           │
│  │  - PensionRoleApplicationController             │           │
│  │  - AdminPensionRoleApplicationController        │           │
│  └────────────────────────┬────────────────────────┘           │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────┐           │
│  │              Services                            │           │
│  │  - Application validation                       │           │
│  │  - Payment verification                         │           │
│  │  - Role assignment                              │           │
│  │  - Notification sending                         │           │
│  └────────────────────────┬────────────────────────┘           │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────┐           │
│  │              Models                              │           │
│  │  - PensionRoleApplication                       │           │
│  │  - PensionPackageRole                           │           │
│  │  - Payment                                      │           │
│  │  - WalletTransaction                            │           │
│  └────────────────────────┬────────────────────────┘           │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                         DATABASE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  pension_role_applications                                │  │
│  │  - id, application_number, user_id                       │  │
│  │  - pension_enrollment_id, requested_role                 │  │
│  │  - status, payment_required, payment_completed           │  │
│  │  - application_reason, supporting_documents              │  │
│  │  - reviewed_by, review_notes, rejection_reason           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  pension_package_roles                                    │  │
│  │  - id, pension_enrollment_id, role                       │  │
│  │  - assigned_by, is_active, assigned_at                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  payments                                                 │  │
│  │  - id, user_id, amount, payment_method                   │  │
│  │  - payment_type, status, gateway_transaction_id          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  wallet_transactions                                      │  │
│  │  - id, wallet_id, transaction_type, category             │  │
│  │  - amount, reference_type, reference_id, payment_id      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Member Application Flow

```
┌─────────────┐
│   Member    │
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Click "Apply for Role"
       ▼
┌─────────────────────┐
│ GET /available-     │
│     roles           │
└──────┬──────────────┘
       │
       │ 2. Returns available roles
       ▼
┌─────────────────────┐
│  Select Role &      │
│  Fill Form          │
└──────┬──────────────┘
       │
       │ 3. Submit application
       ▼
┌─────────────────────┐
│ POST /applications  │
│  - pension_enrollment_id
│  - requested_role   │
│  - application_reason
│  - documents        │
└──────┬──────────────┘
       │
       │ 4. Create application record
       ▼
┌─────────────────────┐
│   Database          │
│   - Save application│
│   - Status: payment_│
│     pending or      │
│     under_review    │
└──────┬──────────────┘
       │
       │ 5. Return application data
       ▼
┌─────────────────────┐
│  Show Success       │
│  Message            │
└─────────────────────┘
```

---

### 2. Payment Flow (Executive Member)

```
┌─────────────┐
│   Member    │
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Click "Pay Now"
       ▼
┌─────────────────────┐
│ POST /initiate-     │
│      payment        │
└──────┬──────────────┘
       │
       │ 2. Create payment record
       ▼
┌─────────────────────┐
│   Database          │
│   - Create payment  │
│   - Generate invoice│
└──────┬──────────────┘
       │
       │ 3. Return payment_id
       ▼
┌─────────────────────┐
│ POST /bkash/        │
│      create-payment │
│  - amount: 60000    │
│  - payment_type     │
└──────┬──────────────┘
       │
       │ 4. Create bKash payment
       ▼
┌─────────────────────┐
│   bKash Gateway     │
│   - Generate URL    │
│   - Return paymentID│
└──────┬──────────────┘
       │
       │ 5. Redirect to bKash
       ▼
┌─────────────────────┐
│  Member Completes   │
│  Payment on bKash   │
└──────┬──────────────┘
       │
       │ 6. bKash callback
       ▼
┌─────────────────────┐
│ GET /bkash/callback │
│  ?paymentID=xxx     │
│  &status=success    │
└──────┬──────────────┘
       │
       │ 7. Update records
       ▼
┌─────────────────────┐
│   Database          │
│   - Payment: completed
│   - Application:    │
│     under_review    │
│   - Create wallet   │
│     transaction     │
└──────┬──────────────┘
       │
       │ 8. Redirect to success page
       ▼
┌─────────────────────┐
│  Payment Success    │
│  Page               │
└─────────────────────┘
```

---

### 3. Admin Approval Flow

```
┌─────────────┐
│   Admin     │
│   Panel     │
└──────┬──────┘
       │
       │ 1. View applications
       ▼
┌─────────────────────┐
│ GET /admin/         │
│     applications    │
│  ?status=under_     │
│   review            │
└──────┬──────────────┘
       │
       │ 2. Return filtered applications
       ▼
┌─────────────────────┐
│  Display            │
│  Applications       │
│  Table              │
└──────┬──────────────┘
       │
       │ 3. Click "Approve"
       ▼
┌─────────────────────┐
│  Verify Payment     │
│  (if required)      │
└──────┬──────────────┘
       │
       │ 4. Submit approval
       ▼
┌─────────────────────┐
│ POST /admin/        │
│      approve        │
│  - review_notes     │
└──────┬──────────────┘
       │
       │ 5. Process approval
       ▼
┌─────────────────────┐
│   Backend           │
│   - Update status   │
│   - Create role     │
│   - Send notification
└──────┬──────────────┘
       │
       │ 6. Update database
       ▼
┌─────────────────────┐
│   Database          │
│   - Application:    │
│     approved        │
│   - Create pension_ │
│     package_role    │
│   - Log activity    │
└──────┬──────────────┘
       │
       │ 7. Return success
       ▼
┌─────────────────────┐
│  Show Success       │
│  Message            │
│  Refresh List       │
└─────────────────────┘
```

---

## 🗂️ File Structure

```
project-root/
│
├── app/(auth)/
│   ├── dashboard/
│   │   └── role-application/
│   │       └── page.tsx                    # Member application page
│   │
│   └── admin/
│       └── pension-role-applications/
│           └── page.tsx                    # Admin management page
│
├── lib/
│   ├── api/
│   │   └── functions/
│   │       └── user/
│   │           └── pensionRoleApplicationApi.ts  # API functions
│   │
│   └── hooks/
│       └── user/
│           └── usePensionRoleApplications.ts     # React hooks
│
├── components/
│   └── admin/
│       ├── sidebar-items.tsx               # Admin sidebar config
│       └── user-sidebar-items.tsx          # User sidebar config
│
└── docs/
    ├── PENSION_ROLE_APIS_COMPLETE.md       # API documentation
    ├── PENSION_ROLE_APPLICATION_FRONTEND.md # Frontend docs
    ├── PENSION_ROLE_APPLICATION_QUICK_START.md # User guide
    ├── PENSION_ROLE_APPLICATION_SUMMARY.md  # Summary
    └── PENSION_ROLE_APPLICATION_ARCHITECTURE.md # This file
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Authentication                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - JWT Token validation                            │    │
│  │  - Session management                              │    │
│  │  - Role-based access control                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Layer 2: Authorization                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Member can only view own applications           │    │
│  │  - Admin can view all applications                 │    │
│  │  - Role-specific permissions                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Layer 3: Data Validation                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Input sanitization                              │    │
│  │  - File type validation                            │    │
│  │  - File size limits (5MB)                          │    │
│  │  - SQL injection prevention                        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Layer 4: Payment Security                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - bKash secure gateway                            │    │
│  │  - Payment verification                            │    │
│  │  - Transaction logging                             │    │
│  │  - Fraud detection                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Layer 5: Data Encryption                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - HTTPS/TLS encryption                            │    │
│  │  - Database encryption                             │    │
│  │  - Secure file storage                             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌─────────────────────────┐
│        users            │
│  - id                   │
│  - email                │
│  - roles                │
└───────┬─────────────────┘
        │
        │ 1:N
        │
┌───────▼─────────────────┐
│  pension_enrollments    │
│  - id                   │
│  - user_id              │
│  - pension_package_id   │
│  - status               │
└───────┬─────────────────┘
        │
        │ 1:N
        │
┌───────▼─────────────────────────────┐
│  pension_role_applications          │
│  - id                               │
│  - user_id                          │
│  - pension_enrollment_id            │
│  - requested_role                   │
│  - status                           │
│  - payment_id                       │
│  - pension_package_role_id          │
└───────┬─────────────────────────────┘
        │
        ├─────────────────┐
        │                 │
        │ N:1             │ 1:1
        │                 │
┌───────▼─────────┐  ┌────▼──────────────────┐
│   payments      │  │ pension_package_roles │
│  - id           │  │  - id                 │
│  - user_id      │  │  - pension_enrollment_│
│  - amount       │  │    id                 │
│  - status       │  │  - role               │
└───────┬─────────┘  │  - is_active          │
        │            └───────────────────────┘
        │ 1:N
        │
┌───────▼─────────────────┐
│  wallet_transactions    │
│  - id                   │
│  - payment_id           │
│  - reference_type       │
│  - reference_id         │
│  - amount               │
└─────────────────────────┘
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    React Query State                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Query Keys:                                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - ["available-roles"]                             │    │
│  │  - ["my-applications", params]                     │    │
│  │  - ["application-details", id]                     │    │
│  │  - ["my-application-stats"]                        │    │
│  │  - ["admin-applications", params]                  │    │
│  │  - ["application-stats"]                           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Cache Invalidation:                                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  On Submit:                                        │    │
│  │    - Invalidate ["my-applications"]                │    │
│  │    - Invalidate ["my-application-stats"]           │    │
│  │                                                     │    │
│  │  On Approve/Reject:                                │    │
│  │    - Invalidate ["admin-applications"]             │    │
│  │    - Invalidate ["application-stats"]              │    │
│  │                                                     │    │
│  │  On Cancel:                                        │    │
│  │    - Invalidate ["my-applications"]                │    │
│  │    - Invalidate ["my-application-stats"]           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Optimistic Updates:                                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Update UI immediately                           │    │
│  │  - Rollback on error                               │    │
│  │  - Show loading states                             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

### Member Dashboard Page

```
RoleApplicationPage
│
├── Header
│   ├── Back Button
│   └── Title
│
├── Current Role Card
│   ├── Role Badge
│   └── Enrollment Info
│
├── Statistics Grid
│   ├── Total Applications
│   ├── Under Review
│   ├── Approved
│   └── Payment Pending
│
├── Main Content (2 columns)
│   │
│   ├── Left Column (Available Roles)
│   │   ├── Available Roles List
│   │   │   ├── Role Card (Executive Member)
│   │   │   ├── Role Card (Project Presenter)
│   │   │   └── Role Card (Assistant PP)
│   │   │
│   │   └── Application Form (conditional)
│   │       ├── Reason Textarea
│   │       ├── File Upload
│   │       └── Submit/Cancel Buttons
│   │
│   └── Right Column (My Applications)
│       └── Applications List
│           ├── Application Card
│           │   ├── Status Badge
│           │   ├── Application Number
│           │   ├── Pay Now Button (conditional)
│           │   └── Cancel Button (conditional)
│           └── ...
│
└── Modals
    ├── Payment Modal
    └── Confirmation Modal
```

### Admin Management Page

```
AdminPensionRoleApplicationsPage
│
├── Header
│   └── Title
│
├── Statistics Grid
│   ├── Total Applications
│   ├── Payment Pending
│   ├── Under Review
│   ├── Approved
│   └── Rejected
│
├── Filter Bar
│   ├── Search Input
│   ├── Status Filter
│   ├── Role Filter
│   └── Refresh Button
│
├── Applications Table
│   ├── Table Header
│   └── Table Body
│       └── Application Row
│           ├── Application Info
│           ├── Member Info
│           ├── Role Info
│           ├── Payment Status
│           ├── Status Badge
│           ├── Applied Date
│           └── Action Buttons
│               ├── Approve Button
│               ├── Reject Button
│               └── View Button
│
├── Pagination
│   ├── Page Info
│   ├── Previous Button
│   └── Next Button
│
└── Modals
    ├── Approve Modal
    │   ├── Application Summary
    │   ├── Review Notes Input
    │   └── Approve/Cancel Buttons
    │
    ├── Reject Modal
    │   ├── Application Summary
    │   ├── Rejection Reason Input
    │   ├── Additional Notes Input
    │   └── Reject/Cancel Buttons
    │
    └── View Details Modal
        ├── Full Application Info
        ├── Member Details
        ├── Payment Details
        └── Close Button
```

---

## 🚀 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                Performance Strategies                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. React Query Caching                                      │
│     - Automatic background refetching                        │
│     - Stale-while-revalidate strategy                        │
│     - Cache time: 5 minutes                                  │
│                                                               │
│  2. Code Splitting                                           │
│     - Lazy load modals                                       │
│     - Dynamic imports for heavy components                   │
│     - Route-based code splitting                             │
│                                                               │
│  3. Image Optimization                                       │
│     - Next.js Image component                                │
│     - Lazy loading images                                    │
│     - WebP format support                                    │
│                                                               │
│  4. API Optimization                                         │
│     - Pagination for large lists                             │
│     - Selective field loading                                │
│     - Database indexing                                      │
│                                                               │
│  5. Bundle Optimization                                      │
│     - Tree shaking                                           │
│     - Minification                                           │
│     - Compression (gzip/brotli)                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                  Scalability Strategy                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Horizontal Scaling:                                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Load balancer for multiple servers              │    │
│  │  - Stateless API design                            │    │
│  │  - Session storage in Redis                        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Database Scaling:                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Read replicas for queries                       │    │
│  │  - Write master for mutations                      │    │
│  │  - Database sharding (future)                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  Caching Strategy:                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Redis for session data                          │    │
│  │  - CDN for static assets                           │    │
│  │  - Application-level caching                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  File Storage:                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - AWS S3 or similar object storage                │    │
│  │  - CDN for file delivery                           │    │
│  │  - Automatic cleanup of old files                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎉 Conclusion

This architecture provides:

✅ **Scalable Design** - Can handle growing user base
✅ **Secure Implementation** - Multiple security layers
✅ **Maintainable Code** - Clear separation of concerns
✅ **Optimized Performance** - Fast load times and interactions
✅ **Extensible Structure** - Easy to add new features

**The system is production-ready and built for scale!** 🚀

---

**Last Updated:** April 15, 2026
**Version:** 1.0.0
