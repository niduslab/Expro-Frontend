# Pension Package System - Data Flow Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PENSION PACKAGES PAGE                         │
│  - List all pension packages                                     │
│  - Package stats (enrolled members, installments, etc.)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
            ┌───────────┐ ┌──────────────┐ ┌─────────────────┐
            │   VIEW    │ │     TEAM     │ │   EDIT/DELETE   │
            │  MEMBERS  │ │  COLLECTION  │ │                 │
            └───────────┘ └──────────────┘ └─────────────────┘
                    │              │
                    ▼              ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  MEMBERS PAGE    │  │ TEAM COLLECTIONS │
        │  (Flat List)     │  │ PAGE (Hierarchy) │
        └──────────────────┘  └──────────────────┘
                    │              │
                    └──────┬───────┘
                           ▼
                ┌─────────────────────┐
                │  MEMBER DETAIL PAGE │
                │  - Profile          │
                │  - Enrollments      │
                │  - Hierarchy        │
                │  - Commissions      │
                └─────────────────────┘
```

---

## 1. Pension Packages Page

**Purpose**: Overview of all pension packages with quick actions

**Data Displayed**:
- Package name, monthly amount, status
- Enrolled members count
- Total installments, maturity amount
- Commission per installment

**Actions**:
1. **View Members** → Navigate to Members Page (filtered by package)
2. **Team Collection** → Navigate to Team Collections Page (filtered by package)
3. **Edit/Delete** → Modify package details

**API Calls**:
```javascript
GET /pensionpackages?per_page=100
```

**Navigation Flow**:
```javascript
// View Members Button
onClick={() => {
  window.location.href = `/admin/members?packageId=${packageId}&packageName=${packageName}`;
}}

// Team Collection Button
onClick={() => {
  window.location.href = `/admin/team-collections?packageId=${packageId}&packageName=${packageName}`;
}}
```

---

## 2. Members Page (Flat List View)

**Purpose**: List all members enrolled in a specific pension package

**URL Parameters**:
- `packageId`: Filter members by pension package
- `packageName`: Display in breadcrumb/header

**Data Displayed**:
- Member name, email, phone
- Enrollment status
- Payment progress (installments paid/total)
- Total amount paid
- Sponsor information (who recruited them)

**Actions**:
1. **View Details** → Navigate to Member Detail Page
2. **View Hierarchy** → Show member's position in tree (NEW)
3. **Filter/Search** → Filter by status, search by name

**API Calls**:
```javascript
// Get members enrolled in specific package
GET /pensionenrollments?pension_package_id=${packageId}&per_page=50

// Each enrollment includes:
{
  id: 1,
  user_id: 5,
  pension_package_id: 1,
  sponsored_by: 3, // Who recruited them
  status: "active",
  installments_paid: 10,
  total_amount_paid: 10000,
  user: {
    id: 5,
    email: "user@example.com",
    sponsor_id: 3, // General sponsor (may differ from pension sponsor)
    member: {
      name_english: "John Doe",
      phone: "01712345678"
    }
  }
}
```

**Key Insight**: 
- `sponsored_by` in enrollment = who recruited for THIS pension
- `sponsor_id` in user = general sponsor (may be different)
- Use `sponsored_by` for pension-specific hierarchy

---

## 3. Team Collections Page (Hierarchy View)

**Purpose**: Show team performance organized by team leaders

**URL Parameters**:
- `packageId`: Filter collections by pension package
- `packageName`: Display in header

**Data Displayed**:
- Monthly collections grouped by period
- Team leaders with their team performance
- Member contributions (expandable)
- Commission calculations

**Hierarchy Logic**:
```
Team Leader (Executive Member/PP)
├── Member 1 (contributed 15,000 TK)
├── Member 2 (contributed 12,000 TK)
├── Member 3 (contributed 8,000 TK)
└── Total: 35,000 TK → Commission: 0 (no lakh milestone yet)

When total reaches 100,000 TK:
└── Commission: 10,000 TK (10% of 1 lakh)
```

**API Calls**:
```javascript
// Get team collections for package
GET /teamcollections?pension_package_id=${packageId}&per_page=100

// Get member contributions for a collection
GET /teammembercontributions?team_collection_id=${collectionId}&per_page=100
```

**Data Structure**:
```javascript
{
  team_collections: [
    {
      id: 1,
      team_leader_id: 3,
      period_month: "2024-03",
      total_collection: 150000,
      lakh_milestones_reached: 1,
      commission_eligible_amount: 100000,
      team_member_count: 10,
      active_contributors: 8,
      team_leader: {
        id: 3,
        email: "leader@example.com",
        member: { name_english: "Team Leader" }
      }
    }
  ],
  member_contributions: [
    {
      id: 1,
      team_collection_id: 1,
      member_id: 5,
      total_contribution: 15000,
      contribution_percentage: 10.0,
      commission_earned: 1000,
      member: {
        id: 5,
        email: "member@example.com",
        member: { name_english: "John Doe" }
      }
    }
  ]
}
```

---

## 4. Member Detail Page

**Purpose**: Complete profile and hierarchy view for a single member

**URL**: `/admin/members/${memberId}`

**Data Displayed**:
1. **Profile Section**:
   - Personal information
   - Contact details
   - NID, photo, etc.

2. **Enrollments Section**:
   - All pension packages enrolled in
   - Payment progress for each
   - Status and dates

3. **Hierarchy Section** (NEW):
   - Who sponsored this member
   - Who this member has sponsored (downline)
   - Visual tree representation
   - Team performance if they're a leader

4. **Commission Section**:
   - Total commissions earned
   - Breakdown by type
   - Payment history

**API Calls**:
```javascript
// Get member profile
GET /memberprofile/${userId}

// Get member's enrollments
GET /pensionenrollments?user_id=${userId}

// Get member's downline (who they sponsored)
GET /users?sponsor_id=${userId}

// Get member's commissions
GET /commissions?user_id=${userId}

// If member is a team leader, get their collections
GET /teamcollections?team_leader_id=${userId}
```

---

## 5. Data Relationships

### User → Pension Enrollment → Team Collection

```
User (id: 5)
├── sponsor_id: 3 (general sponsor)
├── Pension Enrollment (id: 10)
│   ├── pension_package_id: 1
│   ├── sponsored_by: 3 (pension sponsor)
│   ├── status: "active"
│   └── Pension Package Role
│       ├── role: "general_member"
│       └── is_active: true
└── Team Member Contribution
    ├── team_collection_id: 1
    ├── total_contribution: 15000
    └── Team Collection
        ├── team_leader_id: 3
        ├── period_month: "2024-03"
        └── total_collection: 150000
```

### Finding Team Leader

```javascript
// Algorithm to find team leader for a member
function findTeamLeader(userId) {
  // 1. Get user's sponsor from pension enrollment
  const enrollment = await getPensionEnrollment(userId);
  const sponsorId = enrollment.sponsored_by;
  
  if (!sponsorId) return null;
  
  // 2. Check if sponsor has leadership role
  const sponsorEnrollment = await getPensionEnrollment(sponsorId);
  const roles = await getPensionPackageRoles(sponsorEnrollment.id);
  
  const isLeader = roles.some(role => 
    ['executive_member', 'project_presenter', 'assistant_pp'].includes(role.role)
  );
  
  if (isLeader) {
    return sponsorId; // This is the team leader
  }
  
  // 3. Recursively check sponsor's sponsor
  return findTeamLeader(sponsorId);
}
```

---

## 6. Recommended Page Enhancements

### A. Members Page - Add Hierarchy View Toggle

```jsx
const [viewMode, setViewMode] = useState<'list' | 'hierarchy'>('list');

// List View: Current flat table
// Hierarchy View: Tree structure showing sponsor relationships
```

### B. Members Page - Add Sponsor Column

```jsx
<td>
  <div>
    <p className="text-sm font-medium">{member.user.member.name_english}</p>
    {member.sponsored_by && (
      <p className="text-xs text-gray-500">
        Sponsored by: {getSponsorName(member.sponsored_by)}
      </p>
    )}
  </div>
</td>
```

### C. Team Collections - Add "View Member Details" Link

```jsx
<td>
  <Link 
    href={`/admin/members/${contrib.member_id}`}
    className="text-blue-600 hover:underline"
  >
    {contrib.member?.member?.name_english}
  </Link>
</td>
```

### D. Member Detail Page - Add Hierarchy Visualization

```jsx
<div className="hierarchy-section">
  <h3>Hierarchy Position</h3>
  
  {/* Upline */}
  <div className="upline">
    <p>Sponsored by:</p>
    <UserCard userId={member.sponsor_id} />
  </div>
  
  {/* Current User */}
  <div className="current-user">
    <UserCard userId={member.id} highlighted />
  </div>
  
  {/* Downline */}
  <div className="downline">
    <p>Has sponsored {downlineCount} members:</p>
    {downline.map(user => (
      <UserCard key={user.id} userId={user.id} />
    ))}
  </div>
</div>
```

---

## 7. Navigation Flow Summary

```
START: Pension Packages Page
│
├─→ [View Members] → Members Page (Flat List)
│   │
│   ├─→ [View Details] → Member Detail Page
│   │   │
│   │   ├─→ View Profile
│   │   ├─→ View Enrollments
│   │   ├─→ View Hierarchy (Upline/Downline)
│   │   └─→ View Commissions
│   │
│   └─→ [Toggle Hierarchy View] → Members Page (Tree View)
│
├─→ [Team Collection] → Team Collections Page
│   │
│   ├─→ [Expand Team Leader] → View Member Contributions
│   │   │
│   │   └─→ [Click Member Name] → Member Detail Page
│   │
│   └─→ [View Month Details] → Detailed Analytics
│
└─→ [Edit/Delete] → Modify Package
```

---

## 8. Key Differences: Members vs Team Collections

| Aspect | Members Page | Team Collections Page |
|--------|-------------|----------------------|
| **View** | Flat list of all members | Grouped by team leaders |
| **Focus** | Individual member progress | Team performance |
| **Data** | Enrollment status, payments | Monthly collections, milestones |
| **Hierarchy** | Optional (can add toggle) | Built-in (leader → members) |
| **Use Case** | Member management | Commission tracking |
| **Filters** | By status, search name | By month, team leader |

---

## 9. Recommended Implementation Order

1. ✅ **Done**: Pension Packages Page with buttons
2. ✅ **Done**: Team Collections Page with hierarchy
3. 🔄 **Next**: Enhance Members Page
   - Add sponsor information column
   - Add hierarchy view toggle
   - Add link to member details
4. 🔄 **Next**: Create/Enhance Member Detail Page
   - Add hierarchy visualization
   - Add commission summary
   - Add team performance (if leader)
5. 🔄 **Optional**: Add breadcrumbs for navigation
6. 🔄 **Optional**: Add analytics dashboard

---

## 10. API Endpoints Summary

### Existing Endpoints (Already Available)
```
GET /pensionpackages
GET /pensionenrollments
GET /teamcollections
GET /teammembercontributions
GET /users
GET /commissions
```

### Needed Endpoints (Check if available)
```
GET /users/{id}/hierarchy          # Get upline and downline
GET /users/{id}/downline           # Get all sponsored users
GET /pensionpackageroles           # Get roles for enrollment
GET /commissions/summary           # Commission summary by user
```

---

## 11. State Management

### URL Parameters (Recommended)
```javascript
// Pension Packages → Members
/admin/members?packageId=1&packageName=Gold%20Package

// Pension Packages → Team Collections
/admin/team-collections?packageId=1&packageName=Gold%20Package

// Members → Member Detail
/admin/members/5

// With context
/admin/members/5?from=package&packageId=1
```

### Benefits:
- ✅ Shareable URLs
- ✅ Browser back/forward works
- ✅ Refresh preserves state
- ✅ No complex state management needed

---

## 12. User Experience Flow

### Scenario 1: Admin wants to see all members in Gold Package
1. Go to Pension Packages page
2. Find "Gold Package" card
3. Click "View Members" button
4. See flat list of all enrolled members
5. Click any member to see details

### Scenario 2: Admin wants to see team performance
1. Go to Pension Packages page
2. Find "Gold Package" card
3. Click "Team Collection" button
4. See monthly collections grouped by team leaders
5. Expand a team leader to see member contributions
6. Click member name to see their details

### Scenario 3: Admin wants to see member's hierarchy
1. From Members page or Team Collections page
2. Click member name/details
3. See member detail page with:
   - Who sponsored them (upline)
   - Who they sponsored (downline)
   - Their team performance (if leader)
   - Commission earnings

---

## Summary

**Current Flow** (Implemented):
```
Pension Packages → [View Members] → Members List (Flat)
                 → [Team Collection] → Team Collections (Hierarchy)
```

**Recommended Enhancement**:
```
Pension Packages → [View Members] → Members List (Flat/Tree Toggle)
                                  → [View Details] → Member Detail (Full Hierarchy)
                 → [Team Collection] → Team Collections (Hierarchy)
                                     → [Click Member] → Member Detail (Full Hierarchy)
```

This creates a cohesive system where:
- **Members Page** = Member management (flat or tree view)
- **Team Collections Page** = Performance tracking (hierarchy built-in)
- **Member Detail Page** = Complete individual view (profile + hierarchy + commissions)

All pages are interconnected with proper navigation and context preservation.
