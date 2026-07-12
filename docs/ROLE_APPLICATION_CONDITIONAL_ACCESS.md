# Role Application - Conditional Access

## 🎯 Overview

The "Apply for Role" feature is now **conditionally displayed** based on the user's current pension role. Only **General Members** can see and access the role application feature.

---

## 🔒 Access Rules

### Who Can See "Apply for Role"?

✅ **General Members** - Can see and access the role application
❌ **Executive Members** - Cannot see the menu item
❌ **Project Presenters** - Cannot see the menu item
❌ **Assistant Project Presenters** - Cannot see the menu item

---

## 🏗️ Implementation

### 1. Dynamic User Sidebar Component

**File:** `components/admin/DynamicUserSidebar.tsx`

This new component:
- Fetches user's dashboard data
- Checks for active pension roles
- Filters out "Apply for Role" menu item if user has an advanced role
- Dynamically renders the sidebar based on user's current role

```typescript
// Check if user has any advanced role
const hasAdvancedRole = pensionEnrollments.some((enrollment: any) => {
  const roles = enrollment.pension_package_roles || [];
  return roles.some((role: any) => 
    role.is_active && 
    ['executive_member', 'project_presenter', 'assistant_pp'].includes(role.role)
  );
});

// Filter out "Apply for Role" if user already has an advanced role
const filteredItems = userSidebarItems.filter(item => {
  if (item.href === "/dashboard/role-application") {
    return !hasAdvancedRole;
  }
  return true;
});
```

### 2. Updated Admin Sidebar

**File:** `components/admin/admin-sidebar.tsx`

Now uses the `DynamicUserSidebar` component for non-admin users:

```typescript
// If not admin, use the dynamic user sidebar that checks for roles
if (!isAdmin) {
  return <DynamicUserSidebar />;
}
```

### 3. Role Application Page Protection

**File:** `app/(auth)/dashboard/role-application/page.tsx`

Added protection at the page level:
- Checks if user has an advanced role
- Shows a friendly message if they try to access the page directly
- Prevents application submission

```typescript
// Check if user has an advanced role
const hasAdvancedRole = currentRole && 
  ['executive_member', 'project_presenter', 'assistant_pp'].includes(currentRole.value);

// Show message if user already has advanced role
if (hasAdvancedRole) {
  return (
    <div>
      <h2>You Already Have an Advanced Role</h2>
      <p>You currently hold the role of {currentRole?.label}</p>
      <p>You cannot apply for additional roles at this time.</p>
    </div>
  );
}
```

---

## 🔄 User Experience Flow

### General Member (Can Apply)

```
1. Login to Dashboard
   ↓
2. See "Apply for Role" in sidebar ✅
   ↓
3. Click "Apply for Role"
   ↓
4. View available roles
   ↓
5. Submit application
   ↓
6. Wait for approval
   ↓
7. Role assigned
   ↓
8. "Apply for Role" menu item disappears ❌
```

### Advanced Role Member (Cannot Apply)

```
1. Login to Dashboard
   ↓
2. "Apply for Role" NOT visible in sidebar ❌
   ↓
3. If they try to access URL directly:
   /dashboard/role-application
   ↓
4. See message: "You Already Have an Advanced Role"
   ↓
5. Cannot submit new applications
```

---

## 📊 Role Hierarchy

```
┌─────────────────────────────────────────────┐
│           GENERAL MEMBER                    │
│  - Can see "Apply for Role" ✅              │
│  - Can submit applications                  │
│  - Can apply for:                           │
│    • Executive Member                       │
│    • Project Presenter                      │
│    • Assistant Project Presenter            │
└─────────────────────────────────────────────┘
                    │
                    │ After Approval
                    ▼
┌─────────────────────────────────────────────┐
│      ADVANCED ROLE MEMBERS                  │
│  - Executive Member                         │
│  - Project Presenter                        │
│  - Assistant Project Presenter              │
│                                             │
│  - Cannot see "Apply for Role" ❌           │
│  - Cannot submit new applications           │
│  - Already have advanced privileges         │
└─────────────────────────────────────────────┘
```

---

## 🎨 UI Changes

### Sidebar for General Member

```
Dashboard
Profile
Wallet
Project
My Pensions
Apply for Role    ← Visible ✅
Nominee
Branch
Notifications
```

### Sidebar for Advanced Role Member

```
Dashboard
Profile
Wallet
Project
My Pensions
                  ← "Apply for Role" Hidden ❌
Nominee
Branch
Notifications
```

---

## 🔍 Technical Details

### Data Source

The component checks the user's pension enrollments from the dashboard API:

```typescript
const { data: dashboardData } = useMemberDashboard();
const pensionEnrollments = dashboardData?.data?.pension_enrollments || [];
```

### Role Detection

Checks for active roles in pension package roles:

```typescript
const hasAdvancedRole = pensionEnrollments.some((enrollment: any) => {
  const roles = enrollment.pension_package_roles || [];
  return roles.some((role: any) => 
    role.is_active && 
    ['executive_member', 'project_presenter', 'assistant_pp'].includes(role.role)
  );
});
```

### Advanced Roles List

```typescript
const ADVANCED_ROLES = [
  'executive_member',
  'project_presenter', 
  'assistant_pp'
];
```

---

## 🧪 Testing Scenarios

### Test Case 1: General Member
1. Login as general member
2. ✅ Verify "Apply for Role" is visible in sidebar
3. ✅ Click and access role application page
4. ✅ Can view available roles
5. ✅ Can submit application

### Test Case 2: Executive Member
1. Login as executive member
2. ❌ Verify "Apply for Role" is NOT visible in sidebar
3. Try to access `/dashboard/role-application` directly
4. ✅ See "You Already Have an Advanced Role" message
5. ❌ Cannot submit new applications

### Test Case 3: Project Presenter
1. Login as project presenter
2. ❌ Verify "Apply for Role" is NOT visible in sidebar
3. Try to access `/dashboard/role-application` directly
4. ✅ See "You Already Have an Advanced Role" message
5. ❌ Cannot submit new applications

### Test Case 4: Role Transition
1. Login as general member
2. ✅ "Apply for Role" is visible
3. Submit application for Executive Member
4. Admin approves application
5. Role assigned to member
6. Refresh page or re-login
7. ❌ "Apply for Role" is now hidden
8. ✅ User sees their new role in profile

---

## 🔐 Security Considerations

### Frontend Protection
- Menu item hidden from sidebar
- Page shows message if accessed directly
- Form submission prevented

### Backend Protection (Already Implemented)
- API validates user's current role
- Prevents duplicate role applications
- Checks if user already has advanced role
- Returns error if trying to apply with existing advanced role

### Defense in Depth
```
Layer 1: UI (Sidebar) - Hide menu item
    ↓
Layer 2: Page - Show message if accessed
    ↓
Layer 3: Form - Prevent submission
    ↓
Layer 4: API - Validate and reject
```

---

## 📝 API Response Example

### General Member (Can Apply)

```json
{
  "success": true,
  "data": {
    "current_role": {
      "value": "general_member",
      "label": "General Member"
    },
    "available_roles": [
      {
        "value": "executive_member",
        "label": "Executive Member",
        "fee": 60000.00
      },
      {
        "value": "project_presenter",
        "label": "Project Presenter",
        "fee": 0
      }
    ]
  }
}
```

### Executive Member (Cannot Apply)

```json
{
  "success": true,
  "data": {
    "current_role": {
      "value": "executive_member",
      "label": "Executive Member"
    },
    "available_roles": []  ← Empty, no roles to apply for
  }
}
```

---

## 🎯 Benefits

### For Users
✅ **Clear Experience** - Only see options relevant to them
✅ **No Confusion** - Won't try to apply when they already have a role
✅ **Better UX** - Cleaner sidebar without unnecessary options

### For Admins
✅ **Fewer Invalid Applications** - Users can't accidentally apply twice
✅ **Less Support Tickets** - Clear messaging prevents confusion
✅ **Better Data Quality** - Only valid applications in the system

### For System
✅ **Reduced Load** - Fewer unnecessary API calls
✅ **Better Performance** - Conditional rendering is efficient
✅ **Cleaner Data** - No duplicate or invalid applications

---

## 🔄 Future Enhancements

### Potential Features
1. **Role Upgrade Path** - Allow upgrading from PP to Executive Member
2. **Role Expiry** - Automatic role expiry and renewal
3. **Multiple Roles** - Allow holding multiple roles simultaneously
4. **Role History** - Show history of role changes
5. **Role Permissions** - Granular permissions per role

### Configuration Options
```typescript
// Future: Make this configurable
const ROLE_APPLICATION_RULES = {
  general_member: {
    canApply: true,
    availableRoles: ['executive_member', 'project_presenter', 'assistant_pp']
  },
  executive_member: {
    canApply: false,  // Or true if we allow upgrades
    availableRoles: []
  },
  project_presenter: {
    canApply: false,
    availableRoles: []
  },
  assistant_pp: {
    canApply: true,  // Could upgrade to PP
    availableRoles: ['project_presenter']
  }
};
```

---

## 📚 Related Files

### Modified Files
1. `components/admin/admin-sidebar.tsx` - Updated to use dynamic sidebar
2. `app/(auth)/dashboard/role-application/page.tsx` - Added role check

### New Files
1. `components/admin/DynamicUserSidebar.tsx` - New dynamic sidebar component

### Unchanged Files
1. `components/admin/user-sidebar-items.tsx` - Still contains all items
2. `lib/api/functions/user/pensionRoleApplicationApi.ts` - No changes needed
3. `lib/hooks/user/usePensionRoleApplications.ts` - No changes needed

---

## ✅ Summary

The "Apply for Role" feature is now **intelligently hidden** for users who already have advanced roles:

- ✅ **Dynamic Sidebar** - Automatically adjusts based on user's role
- ✅ **Page Protection** - Shows friendly message if accessed directly
- ✅ **Better UX** - Users only see relevant options
- ✅ **Secure** - Multiple layers of protection
- ✅ **Performant** - Efficient conditional rendering

**Users with advanced roles (Executive Member, Project Presenter, Assistant PP) will no longer see the "Apply for Role" option in their sidebar!** 🎉

---

**Last Updated:** April 15, 2026
**Version:** 1.1.0
