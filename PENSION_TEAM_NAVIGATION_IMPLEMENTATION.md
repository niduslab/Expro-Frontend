# Pension Team Navigation Implementation

## 📋 Overview

Added role-based navigation to the pension dashboard, allowing users with leadership roles to view and manage their team hierarchy.

---

## ✅ Changes Made

### 1. **Updated Type Definitions**

**File:** `lib/types/admin/pensionsType.ts`

Added support for package roles:

```typescript
export interface PensionPackageRole {
  id: number;
  role: "executive_member" | "project_presenter" | "assistant_pp" | "general_member";
  is_active: boolean;
  assigned_at: string;
  assigned_by: number;
  deactivated_at: string | null;
  notes: string | null;
}

export interface PensionEnrollment {
  // ... existing fields
  package_roles?: PensionPackageRole[];
  current_role?: string;
}
```

### 2. **Enhanced Pensions Page**

**File:** `app/(auth)/dashboard/pensions/page.tsx`

**Added:**
- Navigation tabs (Pension Plans / My Team)
- Role badge display in header
- Conditional rendering based on user roles

**Features:**
- **Role Badge:** Shows the user's highest leadership role
- **My Team Tab:** Only visible to users with leadership roles (EM/PP/APP)
- **Automatic Detection:** Checks `package_roles` array for active non-general_member roles

**Logic:**
```typescript
// Show "My Team" tab if user has any leadership role
enrollments.some((enrollment) => 
  enrollment.package_roles?.some((role) => 
    role.is_active && role.role !== 'general_member'
  )
)
```

### 3. **New Team Page**

**File:** `app/(auth)/dashboard/pensions/team/page.tsx`

**Features:**
- Complete team hierarchy view
- Month selector for historical data
- Summary statistics cards
- Hierarchical tree table with:
  - Member details (name, ID, email)
  - Level badges
  - Role badges (color-coded)
  - Enrollment status
  - Collection amounts
  - Tree structure with visual indentation

**API Integration:**
- Uses `useTeamHierarchyTree()` hook
- Uses `useTeamStats()` hook
- Real-time data from pension hierarchy API

---

## 🎨 Visual Design

### Navigation Tabs

```
┌─────────────────────────────────────────────────┐
│  [Pension Plans] [My Team]                      │
│  ─────────────                                  │
└─────────────────────────────────────────────────┘
```

### Role Badge Display

```
┌─────────────────────────────────────────────────┐
│  Pension Plans              Your Role           │
│  Manage your pension...     [Project Presenter] │
└─────────────────────────────────────────────────┘
```

### Team Hierarchy Table

```
┌──────────────────────────────────────────────────────────────┐
│ Member          │ Level │ Role              │ Status │ ...   │
├──────────────────────────────────────────────────────────────┤
│ John Doe        │ Lvl 1 │ Project Presenter │ Active │ ...   │
│ └─ Jane Smith   │ Lvl 2 │ General Member    │ Active │ ...   │
│    └─ Bob Lee   │ Lvl 3 │ General Member    │ Active │ ...   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Role-Based Access

### General Members
- ✅ View "Pension Plans" tab
- ❌ No "My Team" tab
- ❌ No role badge displayed

### Leadership Roles (EM/PP/APP)
- ✅ View "Pension Plans" tab
- ✅ View "My Team" tab
- ✅ Role badge displayed
- ✅ Access to team hierarchy
- ✅ View team performance metrics

---

## 📊 Summary Cards (Team Page)

1. **Total Members** - Count of all team members
2. **This Month Collection** - Current month's total collection (in Lakhs)
3. **Total Installments** - Number of installments paid this month
4. **Direct Members** - Count of level 1 team members

---

## 🔄 Data Flow

```
User Login
    ↓
Fetch Enrollments (with package_roles)
    ↓
Check for Leadership Roles
    ↓
    ├─ Has Leadership Role?
    │   ├─ Yes → Show "My Team" tab + Role badge
    │   └─ No  → Show only "Pension Plans" tab
    ↓
User Clicks "My Team"
    ↓
Fetch Team Hierarchy (useTeamHierarchyTree)
    ↓
Display Team Tree + Statistics
```

---

## 🎨 Color Coding

### Role Badges
- 🟡 **Executive Member** - `#F59E0B` (Amber)
- 🔵 **Project Presenter** - `#3B82F6` (Blue)
- 🟣 **Assistant PP** - `#6366F1` (Indigo)
- ⚪ **General Member** - `#6B7280` (Gray)

### Status Badges
- 🟢 **Active** - `#068847` (Green)
- 🟡 **Pending** - `#F59E0B` (Amber)
- 🔴 **Overdue** - `#DC2626` (Red)

---

## 📱 Responsive Design

- Mobile-friendly layout
- Collapsible hierarchy on small screens
- Responsive summary cards (1 col → 2 col → 4 col)
- Touch-friendly navigation tabs

---

## 🧪 Testing Checklist

- [ ] General member sees only "Pension Plans" tab
- [ ] Executive Member sees both tabs + role badge
- [ ] Project Presenter sees both tabs + role badge
- [ ] Assistant PP sees both tabs + role badge
- [ ] Team hierarchy loads correctly
- [ ] Month selector works
- [ ] Tree structure displays with proper indentation
- [ ] Role badges show correct colors
- [ ] Collection amounts display correctly
- [ ] Navigation between tabs works smoothly

---

## 🔗 Related Files

### Modified
- `app/(auth)/dashboard/pensions/page.tsx`
- `lib/types/admin/pensionsType.ts`

### Created
- `app/(auth)/dashboard/pensions/team/page.tsx`

### Dependencies
- `lib/hooks/user/usePensionTeam.ts` (previously created)
- `lib/api/functions/user/pensionTeamApi.ts` (previously created)

---

## 📝 API Endpoints Used

### Member Endpoints
- `GET /api/v1/pension/team/hierarchy-tree` - Complete team hierarchy
- `GET /api/v1/pension/team/stats` - Team statistics

### Data Structure
```json
{
  "package_roles": [
    {
      "id": 18,
      "role": "project_presenter",
      "is_active": true,
      "assigned_at": "2026-04-10 23:44:11",
      "assigned_by": 2,
      "deactivated_at": null,
      "notes": null
    },
    {
      "id": 16,
      "role": "general_member",
      "is_active": true,
      "assigned_at": "2026-04-10 22:48:44",
      "assigned_by": 2,
      "deactivated_at": null,
      "notes": null
    }
  ],
  "current_role": "project_presenter"
}
```

---

## 🚀 Future Enhancements

- [ ] Add team member search/filter
- [ ] Export team data to CSV
- [ ] Add team performance charts
- [ ] Show commission breakdown
- [ ] Add team member contact features
- [ ] Implement team messaging
- [ ] Add team goals and targets
- [ ] Show historical performance trends

---

## ✨ Key Benefits

1. **Role-Based Access** - Automatic detection and display
2. **Clean UI** - Seamless integration with existing design
3. **Performance** - Efficient data loading with React Query
4. **User Experience** - Intuitive navigation and clear hierarchy
5. **Scalability** - Easy to add more features and roles
6. **Type Safety** - Full TypeScript support

---

**Implementation Complete! 🎉**
