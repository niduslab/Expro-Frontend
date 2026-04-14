# Pension Hierarchy Hooks - Implementation Guide

## 📋 Overview

This guide covers the newly implemented React Query hooks for the Pension Hierarchy API endpoints. The hooks are organized into **Member hooks** (for authenticated users) and **Admin hooks** (for admin users).

## 🔗 Quick Reference

### Member Hooks (7 endpoints)
- `useTeamHierarchyTree()` - Complete team hierarchy tree ⭐ **RECOMMENDED FOR DASHBOARD**
- `useTeamMembers()` - Paginated team members list
- `useDirectTeamMembers()` - Direct team only (level 1)
- `useTeamStats()` - Team statistics only
- `useTeamCollections()` - Monthly collections data
- `useTeamUpline()` - Your sponsors chain
- `useTeamMemberDetails()` - Specific member details

### Admin Hooks (3 endpoints)
- `usePackageHierarchy()` - Package hierarchy view ⭐
- `useUserHierarchy()` - User hierarchy investigation ⭐
- `usePensionHierarchyOverview()` - All packages overview ⭐

---

## 📁 File Structure

```
lib/
├── api/functions/
│   ├── user/
│   │   └── pensionTeamApi.ts          # Member API functions
│   └── admin/
│       └── pensionHierarchyApi.ts     # Admin API functions
├── hooks/
│   ├── user/
│   │   └── usePensionTeam.ts          # Member hooks
│   ├── admin/
│   │   └── usePensionHierarchy.ts     # Admin hooks
│   └── index.ts                       # Updated exports
```

---

## 🎯 Member Hooks Usage

### 1. useTeamHierarchyTree() ⭐ **PRIMARY DASHBOARD HOOK**

**Purpose:** Get complete team hierarchy as nested tree with all stats and collections

```typescript
import { useTeamHierarchyTree } from '@/lib/hooks';

const TeamDashboard = () => {
  const { data, isLoading, error } = useTeamHierarchyTree('2026-04');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  const tree = data?.data.tree;
  const totals = data?.data.totals;
  
  return (
    <div>
      <SummaryCards 
        totalMembers={totals?.total_members}
        totalCollection={totals?.total_collection}
      />
      <HierarchyTree tree={tree} />
    </div>
  );
};
```

**Key Features:**
- Complete nested hierarchy structure
- All stats and collections in one call
- Month filtering support
- Perfect for main dashboard

### 2. useTeamMembers()

**Purpose:** Paginated list of all team members with filters

```typescript
import { useTeamMembers } from '@/lib/hooks';

const TeamMembersList = () => {
  const [filters, setFilters] = useState({
    level: 1,
    page: 1,
    per_page: 20,
    role: 'general_member'
  });
  
  const { data, isLoading } = useTeamMembers(filters);
  
  return (
    <div>
      <FilterPanel onFiltersChange={setFilters} />
      <DataTable 
        data={data?.data} 
        pagination={data?.pagination}
      />
    </div>
  );
};
```

### 3. useDirectTeamMembers()

**Purpose:** Get only direct team members (level 1)

```typescript
import { useDirectTeamMembers } from '@/lib/hooks';

const DirectTeamWidget = () => {
  const { data, isLoading } = useDirectTeamMembers('2026-04');
  
  return (
    <div className="direct-team-card">
      <h3>Direct Team ({data?.total})</h3>
      <ul>
        {data?.data.map(member => (
          <li key={member.user_id}>
            {member.name_english} - {member.collection.current_month} BDT
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### 4. useTeamStats()

**Purpose:** Quick team statistics (lightweight, no collection data)

```typescript
import { useTeamStats } from '@/lib/hooks';

const StatsCards = () => {
  const { data, isLoading } = useTeamStats();
  
  const stats = data?.data;
  
  return (
    <div className="stats-grid">
      <StatCard title="Total Members" value={stats?.total_members} />
      <StatCard title="Direct Members" value={stats?.direct_members} />
      <StatCard title="Active Members" value={stats?.by_status.active} />
    </div>
  );
};
```

### 5. useTeamCollections()

**Purpose:** Monthly collection summary and reports

```typescript
import { useTeamCollections } from '@/lib/hooks';

const CollectionReport = () => {
  const [month, setMonth] = useState('2026-04');
  const { data, isLoading } = useTeamCollections(month);
  
  const collections = data?.data;
  
  return (
    <div>
      <MonthSelector value={month} onChange={setMonth} />
      <CollectionSummary 
        total={collections?.total_collection}
        installments={collections?.total_installments}
      />
      <CollectionByLevel data={collections?.by_level} />
      <TopPerformers data={collections?.by_member} />
    </div>
  );
};
```

### 6. useTeamUpline()

**Purpose:** Show upline sponsors chain

```typescript
import { useTeamUpline } from '@/lib/hooks';

const UplineChain = () => {
  const { data, isLoading } = useTeamUpline();
  
  const upline = data?.data.data;
  
  return (
    <div className="upline-chain">
      <h3>Your Sponsors</h3>
      {upline?.map((sponsor, index) => (
        <div key={sponsor.user_id} className="sponsor-card">
          <span>Level {sponsor.level}</span>
          <span>{sponsor.name}</span>
          <span>{sponsor.role}</span>
        </div>
      ))}
    </div>
  );
};
```

### 7. useTeamMemberDetails()

**Purpose:** Detailed member information

```typescript
import { useTeamMemberDetails } from '@/lib/hooks';

const MemberDetailModal = ({ userId }: { userId: number }) => {
  const { data, isLoading } = useTeamMemberDetails(userId);
  
  const member = data?.data;
  
  return (
    <div className="member-details">
      <MemberHeader member={member?.member} />
      <EnrollmentInfo enrollment={member?.enrollment} />
      <PaymentHistory payments={member?.recent_payments} />
      <TeamStats stats={member?.member_team_stats} />
    </div>
  );
};
```

---

## 🔧 Admin Hooks Usage

### 1. usePackageHierarchy()

**Purpose:** View complete hierarchy for a pension package

```typescript
import { usePackageHierarchy } from '@/lib/hooks';

const AdminPackageView = ({ packageId }: { packageId: number }) => {
  const { data, isLoading } = usePackageHierarchy(packageId, '2026-04');
  
  const packageData = data?.data;
  
  return (
    <div>
      <PackageHeader package={packageData?.package} />
      <PackageTotals totals={packageData?.totals} />
      {packageData?.hierarchies.map(hierarchy => (
        <HierarchyTree 
          key={hierarchy.root_user_id}
          root={hierarchy}
        />
      ))}
    </div>
  );
};
```

### 2. useUserHierarchy()

**Purpose:** Investigate specific user's hierarchy

```typescript
import { useUserHierarchy } from '@/lib/hooks';

const AdminUserInvestigation = ({ userId }: { userId: number }) => {
  const { data, isLoading } = useUserHierarchy(userId, '2026-04');
  
  const userData = data?.data;
  
  return (
    <div>
      <UserHeader user={userData?.user} />
      <UplineChain upline={userData?.upline} />
      <DownlineTree tree={userData?.downline_tree} />
      <UserStats stats={userData?.stats} />
    </div>
  );
};
```

### 3. usePensionHierarchyOverview()

**Purpose:** System overview of all packages

```typescript
import { usePensionHierarchyOverview } from '@/lib/hooks';

const AdminDashboard = () => {
  const { data, isLoading } = usePensionHierarchyOverview();
  
  const packages = data?.data;
  
  return (
    <div className="admin-overview">
      <h2>Pension Packages Overview</h2>
      <div className="packages-grid">
        {packages?.map(pkg => (
          <PackageCard 
            key={pkg.package_id}
            package={pkg}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 🎨 Component Examples

### Dashboard Summary Cards

```typescript
const DashboardSummary = () => {
  const { data: hierarchyData } = useTeamHierarchyTree();
  const { data: statsData } = useTeamStats();
  
  const totals = hierarchyData?.data.totals;
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <SummaryCard 
        title="Total Members"
        value={totals?.total_members}
        icon="👥"
      />
      <SummaryCard 
        title="This Month Collection"
        value={`${totals?.total_collection} BDT`}
        icon="💰"
      />
      <SummaryCard 
        title="Total Installments"
        value={totals?.total_installments}
        icon="📊"
      />
      <SummaryCard 
        title="Active Members"
        value={statsData?.data.by_status.active}
        icon="✅"
      />
    </div>
  );
};
```

### Hierarchy Tree Component

```typescript
const HierarchyTreeNode = ({ member }: { member: TeamMember }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="tree-node">
      <div className="member-card">
        <button onClick={() => setExpanded(!expanded)}>
          {member.children?.length > 0 && (expanded ? '▼' : '▶')}
        </button>
        <span>{member.name_english}</span>
        <span>{member.collection.current_month} BDT</span>
        <span>Level {member.level}</span>
      </div>
      
      {expanded && member.children && (
        <div className="children ml-6">
          {member.children.map(child => (
            <HierarchyTreeNode key={child.user_id} member={child} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 🚀 Best Practices

### 1. **Use the Right Hook for the Job**
- **Dashboard:** `useTeamHierarchyTree()` - Complete data in one call
- **Lists:** `useTeamMembers()` - Paginated with filters
- **Quick Stats:** `useTeamStats()` - Lightweight, fast
- **Reports:** `useTeamCollections()` - Detailed collection data

### 2. **Optimize Performance**
```typescript
// ✅ Good: Use hierarchy tree for dashboard
const { data } = useTeamHierarchyTree();

// ❌ Avoid: Multiple API calls for same data
const { data: members } = useTeamMembers();
const { data: stats } = useTeamStats();
const { data: collections } = useTeamCollections();
```

### 3. **Handle Loading States**
```typescript
const TeamDashboard = () => {
  const { data, isLoading, error } = useTeamHierarchyTree();
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return <DashboardContent data={data} />;
};
```

### 4. **Month Filtering**
```typescript
const [selectedMonth, setSelectedMonth] = useState(
  new Date().toISOString().slice(0, 7) // Current month: "2026-04"
);

const { data } = useTeamHierarchyTree(selectedMonth);
```

### 5. **Conditional Queries**
```typescript
// Only fetch member details when userId is available
const { data } = useTeamMemberDetails(userId);
// Hook automatically handles enabled: !!userId
```

---

## 🔍 Error Handling

All hooks return consistent error handling:

```typescript
const { data, isLoading, error, isError } = useTeamHierarchyTree();

if (isError) {
  console.error('API Error:', error);
  // Handle specific error cases
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 403) {
    // Show permission denied
  }
}
```

---

## 📊 Data Structure Reference

### HierarchyTreeData
```typescript
{
  tree: TeamMember[];           // Nested hierarchy
  totals: {
    total_members: number;
    total_collection: number;
    total_installments: number;
    by_level: Record<string, { members: number; collection: number }>;
    by_role: Record<string, number>;
  };
  period: string;               // "2026-04"
}
```

### TeamMember
```typescript
{
  user_id: number;
  member_id: string;            // "EWF-2024-025"
  name_english: string;
  email: string;
  mobile: string;
  level: number;                // 1, 2, 3, etc.
  role: string;                 // "general_member", "project_presenter"
  enrollment: {
    id: number;
    status: string;             // "active", "pending", "overdue"
    installments_paid: number;
  };
  package: {
    name: string;
    monthly_amount: number;
  };
  collection: {
    current_month: number;
    total_paid: number;
  };
  children?: TeamMember[];      // Nested structure
}
```

---

## 🧪 Testing Examples

```typescript
// Test hierarchy tree hook
import { renderHook, waitFor } from '@testing-library/react';
import { useTeamHierarchyTree } from '@/lib/hooks';

test('should fetch team hierarchy tree', async () => {
  const { result } = renderHook(() => useTeamHierarchyTree('2026-04'));
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  
  expect(result.current.data?.data.tree).toBeDefined();
  expect(result.current.data?.data.totals).toBeDefined();
});
```

---

## 📝 Migration Notes

If you're migrating from existing team/hierarchy hooks:

1. **Replace old hooks:**
   ```typescript
   // Old
   const { data } = useTeamCollections();
   
   // New
   const { data } = useTeamHierarchyTree(); // More complete
   // OR
   const { data } = useTeamCollections(month); // Specific collections
   ```

2. **Update imports:**
   ```typescript
   // Add to existing imports
   import { 
     useTeamHierarchyTree,
     useTeamMembers,
     useTeamStats 
   } from '@/lib/hooks';
   ```

3. **Update data access:**
   ```typescript
   // Old structure
   const members = data?.members;
   
   // New structure
   const tree = data?.data.tree;
   const totals = data?.data.totals;
   ```

---

## 🎯 Implementation Checklist

- [x] ✅ Member API functions (`pensionTeamApi.ts`)
- [x] ✅ Member hooks (`usePensionTeam.ts`)
- [x] ✅ Admin API functions (`pensionHierarchyApi.ts`)
- [x] ✅ Admin hooks (`usePensionHierarchy.ts`)
- [x] ✅ Updated exports (`index.ts`)
- [x] ✅ Documentation (`PENSION_HIERARCHY_HOOKS_GUIDE.md`)

### Next Steps:
- [ ] 🔄 Update existing components to use new hooks
- [ ] 🧪 Add unit tests for hooks
- [ ] 📱 Implement mobile-responsive hierarchy tree
- [ ] 🎨 Create reusable hierarchy components
- [ ] 📊 Add data visualization components

---

## 🆘 Support

For questions or issues:
1. Check the API documentation: `pension_hierarchy_api.md`
2. Review hook implementations in `lib/hooks/`
3. Test with sample data using the provided examples
4. Ensure proper authentication tokens are set

**Happy coding! 🚀**