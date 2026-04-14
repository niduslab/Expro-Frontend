# Pension Hierarchy API - Frontend Implementation Guide

## 📋 Table of Contents
1. [Member Endpoints (7 APIs)](#member-endpoints)
2. [Admin Endpoints (3 APIs)](#admin-endpoints)
3. [Quick Reference](#quick-reference)
4. [Implementation Examples](#implementation-examples)

---

## Member Endpoints

### 1. GET /api/v1/pension/team/hierarchy-tree ⭐ RECOMMENDED FOR DASHBOARD

**Purpose:** Get complete team hierarchy as nested tree with all stats and collections

**Use Case:** Main dashboard for EM/PP/APP

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `month` (optional) - Format: YYYY-MM (default: current month)

**Request Example:**
```bash
GET /api/v1/pension/team/hierarchy-tree?month=2026-04
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "tree": [
      {
        "user_id": 25,
        "member_id": "EWF-2024-025",
        "name_english": "John Doe",
        "name_bangla": "জন ডো",
        "email": "john@example.com",
        "mobile": "01712345678",
        "level": 1,
        "role": "assistant_pp",
        "enrollment": {
          "id": 10,
          "enrollment_number": "PE-2024-010",
          "status": "active",
          "enrollment_date": "2024-01-15",
          "installments_paid": 5,
          "installments_remaining": 95
        },
        "package": {
          "id": 1,
          "name": "Basic",
          "monthly_amount": 300.00,
          "maturity_amount": 50000.00
        },
        "collection": {
          "current_month": 300.00,
          "current_month_installments": 1,
          "total_paid": 1500.00
        },
        "children": []
      }
    ],
    "totals": {
      "total_members": 45,
      "total_collection": 12500.00,
      "total_installments": 42,
      "by_level": {
        "1": { "members": 12, "collection": 3600.00 }
      },
      "by_role": {
        "executive_member": 2,
        "project_presenter": 5,
        "assistant_pp": 8,
        "general_member": 30
      }
    },
    "period": "2026-04"
  }
}
```

**Frontend Usage:**
- Display org chart / tree view
- Show summary cards (total members, collection)
- Render nested hierarchy
- Month selector for historical data

---

### 2. GET /api/v1/pension/team/members

**Purpose:** Get paginated list of all team members with filters

**Use Case:** Team members table/list view

**Authentication:** Required

**Query Parameters:**
- `month` (optional) - Format: YYYY-MM
- `level` (optional) - Filter by level (1, 2, 3, etc.)
- `role` (optional) - Filter by role (executive_member, project_presenter, assistant_pp, general_member)
- `status` (optional) - Filter by status (active, pending, overdue, etc.)
- `per_page` (optional) - Items per page (default: 15)
- `page` (optional) - Page number

**Request Example:**
```bash
GET /api/v1/pension/team/members?level=1&per_page=20&page=1
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "hierarchy_id": 1,
      "level": 1,
      "user_id": 25,
      "member_id": "EWF-2024-025",
      "name_english": "John Doe",
      "email": "john@example.com",
      "mobile": "01712345678",
      "enrollment": {
        "id": 10,
        "status": "active",
        "installments_paid": 5
      },
      "package": {
        "name": "Basic",
        "monthly_amount": 300.00
      },
      "collection": {
        "current_month": 300.00,
        "total_paid": 1500.00
      },
      "role": "general_member"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 45,
    "last_page": 3
  }
}
```

**Frontend Usage:**
- Data table with pagination
- Filter dropdowns (level, role, status)
- Search functionality
- Export to CSV

---

### 3. GET /api/v1/pension/team/direct-members

**Purpose:** Get only direct team members (level 1)

**Use Case:** Quick view of directly sponsored members

**Authentication:** Required

**Query Parameters:**
- `month` (optional) - Format: YYYY-MM

**Request Example:**
```bash
GET /api/v1/pension/team/direct-members?month=2026-04
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 25,
      "member_id": "EWF-2024-025",
      "name_english": "John Doe",
      "email": "john@example.com",
      "enrollment": {
        "status": "active",
        "installments_paid": 5
      },
      "package": {
        "name": "Basic",
        "monthly_amount": 300.00
      },
      "collection": {
        "current_month": 300.00,
        "current_month_installments": 1,
        "total_paid": 1500.00
      },
      "role": "general_member"
    }
  ],
  "total": 12,
  "period": "2026-04"
}
```

**Frontend Usage:**
- Simple list of direct team
- Quick stats card
- Direct team performance

---

### 4. GET /api/v1/pension/team/stats

**Purpose:** Get team statistics only (no collection data)

**Use Case:** Quick stats widget, overview cards

**Authentication:** Required

**Request Example:**
```bash
GET /api/v1/pension/team/stats
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "total_members": 45,
    "direct_members": 12,
    "by_level": {
      "1": 12,
      "2": 25,
      "3": 8
    },
    "by_role": {
      "executive_member": 2,
      "project_presenter": 5,
      "assistant_pp": 8,
      "general_member": 30
    },
    "by_status": {
      "active": 38,
      "pending": 5,
      "overdue": 2
    }
  }
}
```

**Frontend Usage:**
- Dashboard summary cards
- Team composition charts
- Status distribution

---

### 5. GET /api/v1/pension/team/collections

**Purpose:** Get monthly collection summary

**Use Case:** Collection reports, performance tracking

**Authentication:** Required

**Query Parameters:**
- `month` (optional) - Format: YYYY-MM

**Request Example:**
```bash
GET /api/v1/pension/team/collections?month=2026-04
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "period": "2026-04",
    "period_start": "2026-04-01",
    "period_end": "2026-04-30",
    "total_collection": 12500.00,
    "total_installments": 42,
    "active_members": 38,
    "by_level": [
      {
        "level": 1,
        "collection": 3600.00,
        "installments": 12,
        "members": 12
      }
    ],
    "by_member": [
      {
        "user_id": 25,
        "member_id": "EWF-2024-025",
        "name": "John Doe",
        "collection": 300.00,
        "installments": 1
      }
    ]
  }
}
```

**Frontend Usage:**
- Monthly collection report
- Performance charts
- Top performers list
- Collection by level breakdown

---

### 6. GET /api/v1/pension/team/upline

**Purpose:** Get your upline sponsors chain

**Use Case:** Show who sponsored you

**Authentication:** Required

**Request Example:**
```bash
GET /api/v1/pension/team/upline
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "user_id": 10,
      "member_id": "EWF-2024-010",
      "name": "Project Presenter",
      "role": "project_presenter",
      "enrollment_id": 5
    },
    {
      "level": 2,
      "user_id": 5,
      "member_id": "EWF-2024-005",
      "name": "Executive Member",
      "role": "executive_member",
      "enrollment_id": 2
    }
  ],
  "total_levels": 2
}
```

**Frontend Usage:**
- Breadcrumb navigation
- Upline chain display
- Contact upline feature

---

### 7. GET /api/v1/pension/team/member/{userId}/details

**Purpose:** Get detailed information about a specific team member

**Use Case:** Member profile page, detailed view

**Authentication:** Required

**Path Parameters:**
- `userId` (required) - User ID

**Request Example:**
```bash
GET /api/v1/pension/team/member/25/details
Authorization: Bearer YOUR_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "hierarchy": {
      "level": 1,
      "role_in_hierarchy": "general_member"
    },
    "user": {
      "id": 25,
      "email": "john@example.com",
      "status": "active"
    },
    "member": {
      "member_id": "EWF-2024-025",
      "name_english": "John Doe",
      "mobile": "01712345678"
    },
    "enrollment": {
      "enrollment_number": "PE-2024-010",
      "status": "active",
      "installments_paid": 5,
      "next_due_date": "2024-07-01"
    },
    "package": {
      "name": "Basic",
      "monthly_amount": 300.00
    },
    "recent_payments": [
      {
        "installment_number": 5,
        "amount_paid": 300.00,
        "paid_date": "2024-06-05"
      }
    ],
    "member_team_stats": {
      "total_members": 3,
      "direct_members": 3
    }
  }
}
```

**Frontend Usage:**
- Member detail modal/page
- Payment history
- Member's own team stats
- Contact information

---

## Admin Endpoints

### 8. GET /api/v1/admin/pension-package/{packageId}/hierarchy

**Purpose:** View complete hierarchy for a pension package

**Use Case:** Admin package management, overview

**Authentication:** Required (Admin role)

**Path Parameters:**
- `packageId` (required) - Pension package ID

**Query Parameters:**
- `month` (optional) - Format: YYYY-MM

**Request Example:**
```bash
GET /api/v1/admin/pension-package/1/hierarchy?month=2026-04
Authorization: Bearer ADMIN_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "package": {
      "id": 1,
      "name": "Basic",
      "monthly_amount": 300.00
    },
    "hierarchies": [
      {
        "root_user_id": 5,
        "root_member_id": "EWF-2024-005",
        "root_name": "Executive Member 1",
        "tree": []
      }
    ],
    "totals": {
      "total_members": 45,
      "total_collection": 12500.00,
      "total_hierarchies": 2
    },
    "period": "2026-04"
  }
}
```

**Frontend Usage:**
- Admin package dashboard
- Multiple hierarchy trees
- Package performance
- Member distribution

---

### 9. GET /api/v1/admin/user/{userId}/hierarchy

**Purpose:** View complete hierarchy for a specific user

**Use Case:** Admin user investigation, support

**Authentication:** Required (Admin role)

**Path Parameters:**
- `userId` (required) - User ID

**Query Parameters:**
- `month` (optional) - Format: YYYY-MM

**Request Example:**
```bash
GET /api/v1/admin/user/25/hierarchy?month=2026-04
Authorization: Bearer ADMIN_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 25,
      "member_id": "EWF-2024-025",
      "name_english": "John Doe"
    },
    "enrollments": [],
    "upline": [],
    "downline_tree": [],
    "stats": {},
    "totals": {},
    "period": "2026-04"
  }
}
```

**Frontend Usage:**
- Admin user detail page
- Hierarchy investigation
- Support tools
- User position in tree

---

### 10. GET /api/v1/admin/pension-hierarchy/overview

**Purpose:** Get overview of all pension packages

**Use Case:** Admin dashboard, system overview

**Authentication:** Required (Admin role)

**Request Example:**
```bash
GET /api/v1/admin/pension-hierarchy/overview
Authorization: Bearer ADMIN_TOKEN
```

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "package_id": 1,
      "package_name": "Basic",
      "total_enrollments": 45,
      "by_role": {
        "executive_member": 2,
        "project_presenter": 5
      },
      "by_status": {
        "active": 38,
        "pending": 5
      }
    }
  ]
}
```

**Frontend Usage:**
- Admin main dashboard
- Package comparison
- System health overview

---

## Quick Reference

### For Member Dashboard (EM/PP/APP):
**Primary API:** `/pension/team/hierarchy-tree` ⭐
- Use this for main dashboard
- Shows complete tree + stats + collections
- One API call for everything

### For Member List View:
**Primary API:** `/pension/team/members`
- Paginated list
- Filterable by level, role, status
- Good for tables

### For Quick Stats:
**Primary API:** `/pension/team/stats`
- Fast, lightweight
- No collection data
- Perfect for widgets

### For Admin:
**Primary APIs:**
- `/admin/pension-package/{id}/hierarchy` - Package view
- `/admin/user/{id}/hierarchy` - User investigation
- `/admin/pension-hierarchy/overview` - System overview

---

## Implementation Examples

### React Dashboard Component:
```typescript
const TeamDashboard = () => {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState('2026-04');

  useEffect(() => {
    fetch(`/api/v1/pension/team/hierarchy-tree?month=${month}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(result => setData(result.data));
  }, [month]);

  return (
    <div>
      <SummaryCards totals={data?.totals} />
      <HierarchyTree tree={data?.tree} />
    </div>
  );
};
```

### API Service Layer:
```typescript
export const pensionTeamAPI = {
  getHierarchyTree: (month?: string) =>
    api.get('/pension/team/hierarchy-tree', { params: { month } }),
  
  getMembers: (filters) =>
    api.get('/pension/team/members', { params: filters }),
  
  getStats: () =>
    api.get('/pension/team/stats'),
  
  getCollections: (month?: string) =>
    api.get('/pension/team/collections', { params: { month } }),
};
```

---

## Error Handling

All APIs return consistent error format:
```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- 200: Success
- 400: Bad request (invalid parameters)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Server error

---

## Notes for Frontend Team

1. **Use hierarchy-tree for dashboard** - It's the most complete API
2. **Cache responses** - Data doesn't change frequently
3. **Handle loading states** - Tree can be large
4. **Implement pagination** for members list
5. **Add month selector** - All collection APIs support month parameter
6. **Recursive components** - For rendering tree structure
7. **Error boundaries** - Wrap tree components
8. **Mobile responsive** - Tree view needs special handling

---

## Testing Checklist

- [ ] Test with empty team (no members)
- [ ] Test with large team (100+ members)
- [ ] Test month selector (past/current/future)
- [ ] Test pagination (members API)
- [ ] Test filters (level, role, status)
- [ ] Test error states (401, 404, 500)
- [ ] Test loading states
- [ ] Test tree expand/collapse
- [ ] Test mobile view
- [ ] Test admin endpoints (separate permissions)
