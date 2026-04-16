# Complete APIs for Pension Role Applications

## Base URL
```
http://your-domain.com/api/v1
```

---

## 🔵 MEMBER APIs - Apply for Roles

### 1. Check Available Roles (Before Applying)

**Purpose:** See which roles the member can apply for based on their current role.

**Endpoint:** `GET /pension-role-applications/available-roles`

**Headers:**
```
Authorization: Bearer {member_token}
Accept: application/json
```

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/pension-role-applications/available-roles" \
  -H "Authorization: Bearer YOUR_MEMBER_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "current_role": {
      "value": "general_member",
      "label": "General Member",
      "label_bangla": "সাধারণ সদস্য"
    },
    "enrollment": {
      "id": 1,
      "enrollment_number": "PE20260001",
      "pension_package_id": 1,
      "status": "active"
    },
    "available_roles": [
      {
        "value": "executive_member",
        "label": "Executive Member",
        "label_bangla": "নির্বাহী সদস্য",
        "fee": 60000.00,
        "requires_payment": true,
        "description": "Premium member with enhanced benefits and leadership responsibilities"
      },
      {
        "value": "project_presenter",
        "label": "Project Presenter",
        "label_bangla": "প্রকল্প উপস্থাপক",
        "fee": 0,
        "requires_payment": false,
        "description": "Member authorized to present and manage pension projects"
      },
      {
        "value": "assistant_pp",
        "label": "Assistant Project Presenter",
        "label_bangla": "সহকারী প্রকল্প উপস্থাপক",
        "fee": 0,
        "requires_payment": false,
        "description": "Member assisting project presenters in project management"
      }
    ]
  }
}
```

---

### 2. Submit Application (Apply for Role)

**Purpose:** Member submits application for a new pension role.

**Endpoint:** `POST /pension-role-applications`

**Headers:**
```
Authorization: Bearer {member_token}
Accept: application/json
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
pension_enrollment_id: 1
requested_role: executive_member
application_reason: I want to take on leadership responsibilities and contribute more to the organization
supporting_documents[]: file1.pdf (optional)
supporting_documents[]: file2.jpg (optional)
```

**cURL Example:**
```bash
curl -X POST "http://your-domain.com/api/v1/pension-role-applications" \
  -H "Authorization: Bearer YOUR_MEMBER_TOKEN" \
  -H "Accept: application/json" \
  -F "pension_enrollment_id=1" \
  -F "requested_role=executive_member" \
  -F "application_reason=I want to become an executive member" \
  -F "supporting_documents[]=@/path/to/document1.pdf" \
  -F "supporting_documents[]=@/path/to/document2.jpg"
```

**JavaScript/Axios Example:**
```javascript
const formData = new FormData();
formData.append('pension_enrollment_id', 1);
formData.append('requested_role', 'executive_member');
formData.append('application_reason', 'I want to become an executive member');
formData.append('supporting_documents[]', file1); // File object
formData.append('supporting_documents[]', file2); // File object

axios.post('/api/v1/pension-role-applications', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```

**Response (201 Created) - Executive Member (Payment Required):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 1,
    "application_number": "PRA202604150001",
    "user_id": 123,
    "pension_enrollment_id": 1,
    "current_role": "general_member",
    "requested_role": "executive_member",
    "application_fee": 60000.00,
    "payment_required": true,
    "payment_completed": false,
    "payment_id": null,
    "status": "payment_pending",
    "application_reason": "I want to become an executive member",
    "supporting_documents": [
      "pension-role-applications/abc123.pdf",
      "pension-role-applications/def456.jpg"
    ],
    "applied_at": "2026-04-15T10:30:00.000000Z",
    "created_at": "2026-04-15T10:30:00.000000Z",
    "pension_enrollment": {
      "id": 1,
      "enrollment_number": "PE20260001",
      "pension_package": {
        "id": 1,
        "name": "Premium Package"
      }
    }
  },
  "next_step": "Please complete the payment of 60,000.00 TK"
}
```

**Response (201 Created) - Other Roles (No Payment):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 2,
    "application_number": "PRA202604150002",
    "user_id": 123,
    "pension_enrollment_id": 1,
    "current_role": "general_member",
    "requested_role": "project_presenter",
    "application_fee": 0,
    "payment_required": false,
    "payment_completed": false,
    "status": "under_review",
    "applied_at": "2026-04-15T10:35:00.000000Z"
  },
  "next_step": "Your application is under review by admin"
}
```

**Error Response (422 Validation Error):**
```json
{
  "success": false,
  "message": "You already have a pending application for this role"
}
```

---

### 3. View My Applications

**Purpose:** List all applications submitted by the member.

**Endpoint:** `GET /pension-role-applications`

**Headers:**
```
Authorization: Bearer {member_token}
Accept: application/json
```

**Query Parameters:**
- `per_page` (optional): Items per page (default: 10)
- `page` (optional): Page number

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/pension-role-applications?per_page=10&page=1" \
  -H "Authorization: Bearer YOUR_MEMBER_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "application_number": "PRA202604150001",
        "requested_role": "executive_member",
        "application_fee": 60000.00,
        "payment_required": true,
        "payment_completed": true,
        "status": "under_review",
        "applied_at": "2026-04-15T10:30:00.000000Z",
        "pension_enrollment": {
          "enrollment_number": "PE20260001",
          "pension_package": {
            "name": "Premium Package"
          }
        },
        "payment": {
          "id": 456,
          "amount": 60000.00,
          "status": "completed"
        }
      }
    ],
    "per_page": 10,
    "total": 1,
    "last_page": 1
  }
}
```

---

### 4. View Application Details

**Purpose:** View detailed information about a specific application.

**Endpoint:** `GET /pension-role-applications/{id}`

**Headers:**
```
Authorization: Bearer {member_token}
Accept: application/json
```

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/pension-role-applications/1" \
  -H "Authorization: Bearer YOUR_MEMBER_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "application_number": "PRA202604150001",
    "user_id": 123,
    "pension_enrollment_id": 1,
    "current_role": "general_member",
    "requested_role": "executive_member",
    "application_fee": 60000.00,
    "payment_required": true,
    "payment_completed": true,
    "payment_id": 456,
    "payment_date": "2026-04-15T11:00:00.000000Z",
    "status": "approved",
    "application_reason": "I want to become an executive member",
    "supporting_documents": [
      "pension-role-applications/abc123.pdf"
    ],
    "reviewed_by": 999,
    "reviewed_at": "2026-04-15T14:00:00.000000Z",
    "review_notes": "Application approved",
    "pension_package_role_id": 789,
    "role_assigned_at": "2026-04-15T14:00:00.000000Z",
    "applied_at": "2026-04-15T10:30:00.000000Z",
    "pension_enrollment": {
      "id": 1,
      "enrollment_number": "PE20260001",
      "pension_package": {
        "id": 1,
        "name": "Premium Package"
      }
    },
    "payment": {
      "id": 456,
      "amount": 60000.00,
      "status": "completed",
      "payment_method": "bkash",
      "paid_at": "2026-04-15T11:00:00.000000Z"
    },
    "reviewed_by_user": {
      "id": 999,
      "member_profile": {
        "name_english": "Admin User"
      }
    },
    "pension_package_role": {
      "id": 789,
      "role": "executive_member",
      "is_active": true,
      "assigned_at": "2026-04-15T14:00:00.000000Z"
    }
  }
}
```

---

### 5. Cancel Application

**Purpose:** Cancel a pending application (only if not yet approved/rejected).

**Endpoint:** `POST /pension-role-applications/{id}/cancel`

**Headers:**
```
Authorization: Bearer {member_token}
Accept: application/json
```

**cURL Example:**
```bash
curl -X POST "http://your-domain.com/api/v1/pension-role-applications/1/cancel" \
  -H "Authorization: Bearer YOUR_MEMBER_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application cancelled successfully",
  "data": {
    "id": 1,
    "application_number": "PRA202604150001",
    "status": "cancelled",
    "updated_at": "2026-04-15T12:00:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "This application cannot be cancelled. Only pending applications can be cancelled.",
  "current_status": "Approved"
}
```

---

### 6. Get My Statistics

**Purpose:** Get statistics about member's applications.

**Endpoint:** `GET /pension-role-applications/my-stats`

**Headers:**
```
Authorization: Bearer {member_token}
Accept: application/json
```

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/pension-role-applications/my-stats" \
  -H "Authorization: Bearer YOUR_MEMBER_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_applications": 3,
    "pending": 0,
    "payment_pending": 0,
    "under_review": 1,
    "approved": 1,
    "rejected": 1,
    "latest_application": {
      "id": 3,
      "application_number": "PRA202604150003",
      "requested_role": "project_presenter",
      "status": "under_review",
      "applied_at": "2026-04-15T15:00:00.000000Z",
      "pension_enrollment": {
        "enrollment_number": "PE20260001",
        "pension_package": {
          "name": "Premium Package"
        }
      }
    }
  }
}
```

---

## 🔴 ADMIN APIs - Approve/Reject Applications

### 1. List All Applications (Admin)

**Purpose:** View all pension role applications with filters.

**Endpoint:** `GET /admin/pension-role-applications`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
```

**Query Parameters:**
- `status` (optional): pending, payment_pending, under_review, approved, rejected, cancelled
- `requested_role` (optional): executive_member, project_presenter, assistant_pp
- `payment_required` (optional): true, false
- `payment_completed` (optional): true, false
- `search` (optional): Search by application number or member name
- `from_date` (optional): YYYY-MM-DD
- `to_date` (optional): YYYY-MM-DD
- `sort_by` (optional): applied_at, status, etc.
- `sort_order` (optional): asc, desc
- `per_page` (optional): Items per page (default: 20)

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/admin/pension-role-applications?status=under_review&per_page=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "application_number": "PRA202604150001",
        "requested_role": "executive_member",
        "current_role": "general_member",
        "status": "under_review",
        "application_fee": 60000.00,
        "payment_required": true,
        "payment_completed": true,
        "applied_at": "2026-04-15T10:30:00.000000Z",
        "user": {
          "id": 123,
          "email": "member@example.com",
          "member_profile": {
            "name_english": "John Doe",
            "name_bangla": "জন ডো",
            "member_id": "M001",
            "mobile": "01712345678"
          }
        },
        "pension_enrollment": {
          "id": 1,
          "enrollment_number": "PE20260001",
          "pension_package": {
            "id": 1,
            "name": "Premium Package"
          }
        },
        "payment": {
          "id": 456,
          "amount": 60000.00,
          "status": "completed",
          "payment_method": "bkash",
          "paid_at": "2026-04-15T11:00:00.000000Z"
        }
      }
    ],
    "per_page": 20,
    "total": 25,
    "last_page": 2
  }
}
```

---

### 2. View Application Details (Admin)

**Purpose:** View detailed information about any application.

**Endpoint:** `GET /admin/pension-role-applications/{id}`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
```

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/admin/pension-role-applications/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

**Response:** Same as member view but with full details.

---

### 3. ⭐ APPROVE APPLICATION (Assign Role)

**Purpose:** Approve application and automatically assign the role to member.

**Endpoint:** `POST /admin/pension-role-applications/{id}/approve`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "review_notes": "Application meets all requirements. Approved."
}
```

**cURL Example:**
```bash
curl -X POST "http://your-domain.com/api/v1/admin/pension-role-applications/1/approve" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "review_notes": "Application approved"
  }'
```

**JavaScript/Axios Example:**
```javascript
axios.post('/api/v1/admin/pension-role-applications/1/approve', {
  review_notes: 'Application meets all requirements. Approved.'
}, {
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Application approved!', response.data);
  // Role is now assigned to member
})
.catch(error => {
  console.error('Approval failed:', error.response.data);
});
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application approved successfully and role assigned",
  "data": {
    "id": 1,
    "application_number": "PRA202604150001",
    "user_id": 123,
    "pension_enrollment_id": 1,
    "current_role": "general_member",
    "requested_role": "executive_member",
    "status": "approved",
    "reviewed_by": 999,
    "reviewed_at": "2026-04-15T14:00:00.000000Z",
    "review_notes": "Application meets all requirements. Approved.",
    "pension_package_role_id": 789,
    "role_assigned_at": "2026-04-15T14:00:00.000000Z",
    "pension_package_role": {
      "id": 789,
      "pension_enrollment_id": 1,
      "role": "executive_member",
      "assigned_by": 999,
      "is_active": true,
      "assigned_at": "2026-04-15T14:00:00.000000Z",
      "notes": "Assigned via application: PRA202604150001"
    },
    "user": {
      "id": 123,
      "member_profile": {
        "name_english": "John Doe",
        "member_id": "M001"
      }
    },
    "pension_enrollment": {
      "enrollment_number": "PE20260001",
      "pension_package": {
        "name": "Premium Package"
      }
    }
  }
}
```

**Error Response (422) - Cannot Review:**
```json
{
  "success": false,
  "message": "This application cannot be reviewed",
  "current_status": "Approved",
  "reason": "Only applications with status \"Under Review\" can be approved"
}
```

**Error Response (422) - Payment Not Completed:**
```json
{
  "success": false,
  "message": "Payment must be completed before approval",
  "payment_required": 60000.00
}
```

---

### 4. Reject Application

**Purpose:** Reject an application with reason.

**Endpoint:** `POST /admin/pension-role-applications/{id}/reject`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "rejection_reason": "Insufficient documentation provided",
  "review_notes": "Please provide additional proof of experience and qualifications"
}
```

**cURL Example:**
```bash
curl -X POST "http://your-domain.com/api/v1/admin/pension-role-applications/1/reject" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "rejection_reason": "Insufficient documentation",
    "review_notes": "Please provide additional documents"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application rejected",
  "data": {
    "id": 1,
    "application_number": "PRA202604150001",
    "status": "rejected",
    "reviewed_by": 999,
    "reviewed_at": "2026-04-15T14:00:00.000000Z",
    "rejection_reason": "Insufficient documentation provided",
    "review_notes": "Please provide additional proof of experience and qualifications",
    "user": {
      "id": 123,
      "member_profile": {
        "name_english": "John Doe"
      }
    }
  }
}
```

---

### 5. Get Statistics (Admin)

**Purpose:** Get comprehensive statistics about all applications.

**Endpoint:** `GET /admin/pension-role-applications/stats`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
```

**cURL Example:**
```bash
curl -X GET "http://your-domain.com/api/v1/admin/pension-role-applications/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_applications": 150,
    "by_status": {
      "pending": 5,
      "payment_pending": 10,
      "under_review": 25,
      "approved": 90,
      "rejected": 15,
      "cancelled": 5
    },
    "by_role": {
      "executive_member": 80,
      "project_presenter": 50,
      "assistant_pp": 20
    },
    "payment_stats": {
      "total_fees_collected": 4800000.00,
      "pending_payments": 10,
      "pending_payment_amount": 600000.00
    },
    "recent_activity": {
      "today": 5,
      "this_week": 20,
      "this_month": 45
    },
    "pending_review_count": 25,
    "payment_pending_count": 10,
    "latest_applications": [
      {
        "id": 150,
        "application_number": "PRA202604150150",
        "requested_role": "executive_member",
        "status": "under_review",
        "applied_at": "2026-04-15T15:00:00.000000Z",
        "user": {
          "member_profile": {
            "name_english": "Jane Smith",
            "member_id": "M150"
          }
        },
        "pension_enrollment": {
          "enrollment_number": "PE20260150",
          "pension_package": {
            "name": "Premium Package"
          }
        }
      }
    ]
  }
}
```

---

### 6. Bulk Approve Applications

**Purpose:** Approve multiple applications at once.

**Endpoint:** `POST /admin/pension-role-applications/bulk-approve`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "application_ids": [1, 2, 3, 4, 5],
  "review_notes": "Bulk approved - all requirements met"
}
```

**cURL Example:**
```bash
curl -X POST "http://your-domain.com/api/v1/admin/pension-role-applications/bulk-approve" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "application_ids": [1, 2, 3],
    "review_notes": "Bulk approved"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "3 applications approved successfully",
  "data": {
    "approved": [
      {
        "id": 1,
        "application_number": "PRA202604150001"
      },
      {
        "id": 2,
        "application_number": "PRA202604150002"
      },
      {
        "id": 3,
        "application_number": "PRA202604150003"
      }
    ],
    "failed": []
  }
}
```

---

### 7. Bulk Reject Applications

**Purpose:** Reject multiple applications at once.

**Endpoint:** `POST /admin/pension-role-applications/bulk-reject`

**Headers:**
```
Authorization: Bearer {admin_token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "application_ids": [6, 7, 8],
  "rejection_reason": "Incomplete documentation",
  "review_notes": "Please resubmit with complete documents"
}
```

**cURL Example:**
```bash
curl -X POST "http://your-domain.com/api/v1/admin/pension-role-applications/bulk-reject" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "application_ids": [6, 7, 8],
    "rejection_reason": "Incomplete documentation",
    "review_notes": "Please resubmit"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "3 applications rejected",
  "data": {
    "rejected": [
      {
        "id": 6,
        "application_number": "PRA202604150006"
      },
      {
        "id": 7,
        "application_number": "PRA202604150007"
      },
      {
        "id": 8,
        "application_number": "PRA202604150008"
      }
    ],
    "failed": []
  }
}
```

---

## 📊 Complete Workflow Example

### Step 1: Member Checks Available Roles
```bash
GET /api/v1/pension-role-applications/available-roles
```

### Step 2: Member Submits Application
```bash
POST /api/v1/pension-role-applications
{
  "pension_enrollment_id": 1,
  "requested_role": "executive_member",
  "application_reason": "I want to become executive member"
}
```

### Step 3: If Executive Member - Complete Payment
```bash
# Use existing payment gateway
POST /api/v1/bkash/create-payment
{
  "amount": 60000,
  "payment_type": "pension_role_application",
  "reference_id": 1
}
```

### Step 4: Admin Views Pending Applications
```bash
GET /api/v1/admin/pension-role-applications?status=under_review
```

### Step 5: Admin Approves Application
```bash
POST /api/v1/admin/pension-role-applications/1/approve
{
  "review_notes": "Approved"
}
```

### Step 6: Role is Automatically Assigned! ✅

---

## 🎯 Quick Reference

### Member Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/pension-role-applications/available-roles` | Check available roles |
| POST | `/pension-role-applications` | Submit application |
| GET | `/pension-role-applications` | List my applications |
| GET | `/pension-role-applications/{id}` | View application |
| POST | `/pension-role-applications/{id}/cancel` | Cancel application |
| GET | `/pension-role-applications/my-stats` | My statistics |

### Admin Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/pension-role-applications` | List all applications |
| GET | `/admin/pension-role-applications/stats` | Statistics |
| GET | `/admin/pension-role-applications/{id}` | View application |
| POST | `/admin/pension-role-applications/{id}/approve` | ⭐ Approve & assign role |
| POST | `/admin/pension-role-applications/{id}/reject` | Reject application |
| POST | `/admin/pension-role-applications/bulk-approve` | Bulk approve |
| POST | `/admin/pension-role-applications/bulk-reject` | Bulk reject |

---

## 🔑 Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer {your_token_here}
```

Get token from login endpoint:
```bash
POST /api/v1/public/login
{
  "email": "user@example.com",
  "password": "password"
}
```

---

## ✅ Status Values

- `pending` - Initial submission
- `payment_pending` - Awaiting payment (executive member only)
- `under_review` - Ready for admin review
- `approved` - Approved and role assigned
- `rejected` - Rejected by admin
- `cancelled` - Cancelled by member

---

## 💰 Role Fees

- **Executive Member**: 60,000 TK (payment required)
- **Project Presenter**: Free
- **Assistant PP**: Free

---

## 📝 Notes

1. Only applications with status "under_review" can be approved/rejected
2. Executive member applications require payment completion before approval
3. When approved, role is automatically created in `pension_package_roles` table
4. Members can only cancel applications that are not yet approved/rejected
5. File uploads support: PDF, JPG, JPEG, PNG (max 5MB each)
