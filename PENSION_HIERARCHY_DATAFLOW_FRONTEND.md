# Pension Package Hierarchy & Data Flow for Frontend

## Backend Analysis Summary

After analyzing your backend code, here's what I found:

### ✅ What Your Backend SUPPORTS:

1. **Sponsor-based Referral System** ✓
   - `users.sponsor_id` tracks who referred whom
   - `pension_enrollments.sponsored_by` tracks who gets commission
   - Anyone can refer anyone (no role restrictions)

2. **Flexible Role Hierarchy** ✓
   - `pension_package_roles` table with 4 roles:
     - `general_member` (default, required for all)
     - `executive_member` (requires 60,000 TK payment)
     - `project_presenter` (promoted by admin)
     - `assistant_pp` (promoted by admin)
   - One user can have ONE leadership role at a time
   - Role promotion/demotion APIs exist

3. **Commission System** ✓
   - Direct sponsor commissions (joining + installment)
   - Team-based commissions (10% per lakh)
   - Hierarchical commissions (5% of downline)

4. **Team Collections** ✓
   - Tracks monthly performance per team leader
   - Links to team member contributions
   - Calculates lakh milestones

### ❌ What Your Backend DOES NOT Support (Yet):

1. **Minimum 11 Executive Members per Package** ✗
   - No validation or business rule enforcing this
   - No counter tracking EMs per package
   - Would need to be added

2. **Strict Hierarchy (PP → APP → EM)** ✗
   - Current system: Anyone can sponsor anyone
   - No enforcement that APP must be under PP
   - No enforcement that EM must be under APP/PP
   - Hierarchy is flexible, not strict

3. **Package-specific Hierarchy** ✗
   - Roles are per enrollment, but hierarchy isn't package-specific
   - `sponsor_id` is global (user-level), not package-level

---

## Current System Architecture

### How It Actually Works:

```
User Registration
       ↓
[sponsor_id set] ← Can be ANY user (no role requirement)
       ↓
Pension Enrollment
       ↓
[sponsored_by set] ← Usually same as sponsor_id
       ↓
[general_member role assigned automatically]
       ↓
Payment of 60,000 TK → [Promote to executive_member]
       ↓
Admin Promotion → [Promote to project_presenter or assistant_pp]
       ↓
Commissions flow to sponsor_id
```

### Commission Flow:

```
Member Makes Payment (1000 TK)
         ↓
┌────────────────────────────────────┐
│ 1. Direct Sponsor Commission       │
│    - 30 TK installment commission  │
│    → Goes to sponsored_by user     │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ 2. Find Team Leader                │
│    - Traverse up sponsor chain     │
│    - Find first user with EM/PP/APP│
│    - Add to their team_collection  │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ 3. Team Commission (Monthly)       │
│    - When team reaches 1 lakh      │
│    - EM gets 10,000 TK (10%)       │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ 4. Upline Commission               │
│    - EM's sponsor gets 5% of EM's  │
│      total commission              │
└────────────────────────────────────┘
```

---

## Proposed Frontend Hierarchy Display

Since your backend supports flexible sponsorship (not strict PP→APP→EM), here's how to display it:

### Option 1: Sponsor-Based Tree (Current System)

This shows the actual referral network:

```
                    [User A - PP]
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   [User B - EM]    [User C - APP]   [User D - GM]
        │                │                │
    ┌───┴───┐        ┌───┴───┐       ┌───┴───┐
    ↓       ↓        ↓       ↓       ↓       ↓
 [GM]    [GM]     [EM]    [GM]    [GM]    [GM]
```

**Data Source**: `users.sponsor_id` + `pension_package_roles.role`

### Option 2: Team-Based View (Leadership Focus)

This shows who manages which team:

```
┌─────────────────────────────────────────┐
│ Project Presenter: John Doe             │
│ Team Size: 45 | Monthly: 250,000 TK     │
├─────────────────────────────────────────┤
│ Direct Team Members:                    │
│  ├─ Assistant PP: Jane (Team: 15)       │
│  ├─ Executive Member: Bob (Team: 10)    │
│  ├─ Executive Member: Alice (Team: 8)   │
│  └─ General Members: 12                 │
└─────────────────────────────────────────┘
         │
         ├─ [Expand Jane's Team]
         │   ├─ EM: Mike (Team: 5)
         │   └─ GM: 10 members
         │
         └─ [Expand Bob's Team]
             ├─ GM: 10 members
```

**Data Source**: `team_collections` + `team_member_contributions`

### Option 3: Package-Specific Hierarchy

Show hierarchy per pension package:

```
Pension Package: Premium (1500 TK/month)
│
├─ Project Presenters (2)
│   ├─ PP: John (Team: 45, Collection: 250K)
│   └─ PP: Sarah (Team: 38, Collection: 180K)
│
├─ Assistant PPs (5)
│   ├─ APP: Mike (under John, Team: 15)
│   └─ APP: Lisa (under Sarah, Team: 12)
│
├─ Executive Members (18)
│   ├─ EM: Bob (under Mike, Team: 10)
│   └─ EM: Alice (under John, Team: 8)
│
└─ General Members (234)
```

**Data Source**: `pension_enrollments` + `pension_package_roles` filtered by `pension_package_id`

---

## Data Flow for Frontend

### Step 1: Fetch User's Position

```javascript
// API Call
GET /api/v1/users/{userId}/hierarchy-position

// Response
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "sponsor": {
      "id": 45,
      "name": "Jane Smith",
      "role": "project_presenter"
    }
  },
  "enrollments": [
    {
      "id": 1,
      "pension_package": {
        "id": 2,
        "name": "Premium Package"
      },
      "roles": [
        {
          "role": "general_member",
          "is_active": true
        },
        {
          "role": "executive_member",
          "is_active": true,
          "assigned_at": "2024-01-15"
        }
      ],
      "sponsored_by": {
        "id": 45,
        "name": "Jane Smith"
      }
    }
  ]
}
```

### Step 2: Fetch Downline (Who's Under Me)

```javascript
// API Call
GET /api/v1/users/{userId}/downline?pension_package_id=2

// Response
{
  "total_downline": 25,
  "direct_referrals": 5,
  "by_role": {
    "executive_member": 2,
    "assistant_pp": 1,
    "general_member": 22
  },
  "members": [
    {
      "id": 150,
      "name": "Bob Johnson",
      "role": "executive_member",
      "enrolled_at": "2024-02-01",
      "total_contribution": 15000,
      "team_size": 10,
      "level": 1  // Direct referral
    },
    {
      "id": 151,
      "name": "Alice Brown",
      "role": "general_member",
      "enrolled_at": "2024-02-15",
      "total_contribution": 3000,
      "level": 1
    },
    {
      "id": 200,
      "name": "Mike Wilson",
      "role": "general_member",
      "enrolled_at": "2024-03-01",
      "total_contribution": 1000,
      "level": 2,  // Referred by Bob (level 1)
      "referred_by": {
        "id": 150,
        "name": "Bob Johnson"
      }
    }
  ]
}
```

### Step 3: Fetch Team Performance (For Leaders)

```javascript
// API Call
GET /api/v1/users/{userId}/team-performance?period_month=2024-03

// Response
{
  "is_team_leader": true,
  "role": "executive_member",
  "team_collection": {
    "id": 45,
    "period_month": "2024-03",
    "total_collection": 150000,
    "membership_collection": 50000,
    "pension_collection": 100000,
    "lakh_milestones_reached": 1,
    "commission_eligible_amount": 100000,
    "team_member_count": 10,
    "active_contributors": 8
  },
  "member_contributions": [
    {
      "member_id": 151,
      "member_name": "Alice Brown",
      "total_contribution": 15000,
      "contribution_percentage": 10.0,
      "commission_earned": 1000
    },
    {
      "member_id": 200,
      "member_name": "Mike Wilson",
      "total_contribution": 12000,
      "contribution_percentage": 8.0,
      "commission_earned": 800
    }
  ],
  "my_commission": {
    "team_commission": 10000,
    "installment_commissions": 240,
    "total": 10240
  }
}
```

### Step 4: Fetch Package Overview

```javascript
// API Call
GET /api/v1/pension-packages/{packageId}/hierarchy-stats

// Response
{
  "package": {
    "id": 2,
    "name": "Premium Package",
    "monthly_amount": 1500
  },
  "statistics": {
    "total_enrollments": 285,
    "by_role": {
      "project_presenter": 2,
      "assistant_pp": 5,
      "executive_member": 18,
      "general_member": 260
    },
    "total_collection_this_month": 427500,
    "active_teams": 18
  },
  "top_performers": [
    {
      "user_id": 123,
      "name": "John Doe",
      "role": "project_presenter",
      "team_size": 45,
      "monthly_collection": 250000
    },
    {
      "user_id": 124,
      "name": "Sarah Lee",
      "role": "project_presenter",
      "team_size": 38,
      "monthly_collection": 180000
    }
  ]
}
```

---

## Frontend Component Structure

### 1. Hierarchy Tree Component

```jsx
const HierarchyTree = ({ userId, packageId }) => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  useEffect(() => {
    loadHierarchy();
  }, [userId, packageId]);
  
  const loadHierarchy = async () => {
    // Load user's position
    const positionRes = await fetch(`/api/v1/users/${userId}/hierarchy-position`);
    const position = await positionRes.json();
    
    // Load downline
    const downlineRes = await fetch(
      `/api/v1/users/${userId}/downline?pension_package_id=${packageId}`
    );
    const downline = await downlineRes.json();
    
    // Build tree structure
    const tree = buildTreeStructure(position, downline);
    setHierarchyData(tree);
  };
  
  const buildTreeStructure = (position, downline) => {
    // Group by level
    const byLevel = {};
    downline.members.forEach(member => {
      if (!byLevel[member.level]) byLevel[member.level] = [];
      byLevel[member.level].push(member);
    });
    
    // Build recursive structure
    const buildNode = (member, level) => {
      const children = byLevel[level + 1]?.filter(
        m => m.referred_by?.id === member.id
      ) || [];
      
      return {
        ...member,
        children: children.map(child => buildNode(child, level + 1))
      };
    };
    
    return {
      ...position.user,
      enrollments: position.enrollments,
      children: (byLevel[1] || []).map(member => buildNode(member, 1))
    };
  };
  
  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div 
        key={node.id} 
        className="hierarchy-node"
        style={{ marginLeft: level * 40 }}
      >
        <div className="node-card">
          {hasChildren && (
            <button 
              className="expand-btn"
              onClick={() => toggleNode(node.id)}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          
          <div className="node-content">
            <div className="user-info">
              <Avatar src={node.photo} name={node.name} />
              <div>
                <h4>{node.name}</h4>
                <p>{node.email}</p>
              </div>
            </div>
            
            <div className="role-badges">
              {node.roles?.map(role => (
                <span 
                  key={role.role}
                  className={`badge ${role.role}`}
                >
                  {role.role.replace('_', ' ').toUpperCase()}
                </span>
              ))}
            </div>
            
            {node.team_size > 0 && (
              <div className="stats">
                <div className="stat">
                  <label>Team Size</label>
                  <strong>{node.team_size}</strong>
                </div>
                <div className="stat">
                  <label>Monthly Collection</label>
                  <strong>{node.total_contribution} TK</strong>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="children">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };
  
  return (
    <div className="hierarchy-tree">
      <h2>My Network</h2>
      {hierarchyData && renderNode(hierarchyData)}
    </div>
  );
};
```

### 2. Package Hierarchy Overview

```jsx
const PackageHierarchyOverview = ({ packageId }) => {
  const [stats, setStats] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  
  useEffect(() => {
    fetch(`/api/v1/pension-packages/${packageId}/hierarchy-stats`)
      .then(res => res.json())
      .then(setStats);
  }, [packageId]);
  
  if (!stats) return <Loading />;
  
  return (
    <div className="package-overview">
      <h2>{stats.package.name} - Hierarchy Overview</h2>
      
      <div className="role-distribution">
        <h3>Role Distribution</h3>
        <div className="role-cards">
          <div className="role-card pp">
            <h4>Project Presenters</h4>
            <div className="count">{stats.statistics.by_role.project_presenter}</div>
            <p>Top Leadership</p>
          </div>
          
          <div className="role-card app">
            <h4>Assistant PPs</h4>
            <div className="count">{stats.statistics.by_role.assistant_pp}</div>
            <p>Supporting Leadership</p>
          </div>
          
          <div className="role-card em">
            <h4>Executive Members</h4>
            <div className="count">{stats.statistics.by_role.executive_member}</div>
            <p className={stats.statistics.by_role.executive_member < 11 ? 'warning' : ''}>
              {stats.statistics.by_role.executive_member < 11 
                ? `Need ${11 - stats.statistics.by_role.executive_member} more`
                : 'Minimum met ✓'
              }
            </p>
          </div>
          
          <div className="role-card gm">
            <h4>General Members</h4>
            <div className="count">{stats.statistics.by_role.general_member}</div>
            <p>Active Members</p>
          </div>
        </div>
      </div>
      
      <div className="top-performers">
        <h3>Top Performers</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Team Size</th>
              <th>Monthly Collection</th>
            </tr>
          </thead>
          <tbody>
            {stats.top_performers.map(performer => (
              <tr key={performer.user_id}>
                <td>{performer.name}</td>
                <td>
                  <span className={`badge ${performer.role}`}>
                    {performer.role.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>{performer.team_size}</td>
                <td>{performer.monthly_collection.toLocaleString()} TK</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 3. My Team Dashboard (For Leaders)

```jsx
const MyTeamDashboard = ({ userId }) => {
  const [teamData, setTeamData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  
  useEffect(() => {
    loadTeamData();
  }, [userId, selectedMonth]);
  
  const loadTeamData = async () => {
    const res = await fetch(
      `/api/v1/users/${userId}/team-performance?period_month=${selectedMonth}`
    );
    const data = await res.json();
    setTeamData(data);
  };
  
  if (!teamData?.is_team_leader) {
    return (
      <div className="not-leader">
        <p>You are not a team leader yet.</p>
        <p>Become an Executive Member to manage your own team!</p>
      </div>
    );
  }
  
  return (
    <div className="team-dashboard">
      <div className="dashboard-header">
        <h2>My Team Performance</h2>
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {getLastSixMonths().map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      
      <div className="kpi-cards">
        <div className="kpi-card">
          <label>Total Collection</label>
          <h3>{teamData.team_collection.total_collection.toLocaleString()} TK</h3>
          <small>
            Membership: {teamData.team_collection.membership_collection} TK | 
            Pension: {teamData.team_collection.pension_collection} TK
          </small>
        </div>
        
        <div className="kpi-card">
          <label>Lakh Milestones</label>
          <h3>{teamData.team_collection.lakh_milestones_reached}</h3>
          <small>
            Commission: {teamData.team_collection.lakh_milestones_reached * 10000} TK
          </small>
        </div>
        
        <div className="kpi-card">
          <label>Team Members</label>
          <h3>{teamData.team_collection.team_member_count}</h3>
          <small>
            Active: {teamData.team_collection.active_contributors}
          </small>
        </div>
        
        <div className="kpi-card highlight">
          <label>My Commission</label>
          <h3>{teamData.my_commission.total.toLocaleString()} TK</h3>
          <small>
            Team: {teamData.my_commission.team_commission} TK | 
            Installments: {teamData.my_commission.installment_commissions} TK
          </small>
        </div>
      </div>
      
      <div className="member-contributions">
        <h3>Member Contributions</h3>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Contribution</th>
              <th>Share %</th>
              <th>Commission Earned</th>
            </tr>
          </thead>
          <tbody>
            {teamData.member_contributions.map(contrib => (
              <tr key={contrib.member_id}>
                <td>{contrib.member_name}</td>
                <td>{contrib.total_contribution.toLocaleString()} TK</td>
                <td>{contrib.contribution_percentage}%</td>
                <td>{contrib.commission_earned.toLocaleString()} TK</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## Required Backend APIs (To Be Created)

Based on the frontend needs, you'll need these new endpoints:

```php
// 1. Get user's hierarchy position
GET /api/v1/users/{id}/hierarchy-position
// Returns: user info, enrollments, roles, sponsor

// 2. Get user's downline
GET /api/v1/users/{id}/downline?pension_package_id={packageId}
// Returns: all users sponsored by this user, with their roles and stats

// 3. Get team performance
GET /api/v1/users/{id}/team-performance?period_month={month}
// Returns: team collection data, member contributions, commissions

// 4. Get package hierarchy stats
GET /api/v1/pension-packages/{id}/hierarchy-stats
// Returns: role distribution, top performers, package stats
```

---

## Summary

### Your Backend Currently Supports:
✅ Flexible sponsor-based referral system  
✅ Role-based hierarchy (GM, EM, PP, APP)  
✅ Commission calculations  
✅ Team collections and contributions  
✅ Role promotion/demotion  

### Your Backend Does NOT Support (Yet):
❌ Minimum 11 EMs per package validation  
❌ Strict hierarchy enforcement (PP→APP→EM)  
❌ Package-specific sponsor relationships  

### Recommended Approach:
1. Use the **flexible sponsor tree** (current system)
2. Display roles as badges on each node
3. Show team performance for leaders
4. Add visual indicators for role requirements
5. Implement the 4 new API endpoints above
6. Consider adding validation for 11 EMs if needed

The frontend can show a beautiful hierarchy tree based on `sponsor_id` relationships, with role badges, team stats, and commission data overlaid on each node!
