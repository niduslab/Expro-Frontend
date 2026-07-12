# Pension Package Hierarchy & Commission System

## System Overview

This document explains how the pension enrollment system, team collections, and commission structure work together to create a hierarchical network marketing system.

---

## 1. Core Entities & Their Relationships

### 1.1 Users Table
- **sponsor_id**: References another user who recruited this member
- Creates a tree structure where each user can sponsor multiple users
- This is the foundation of the commission hierarchy

### 1.2 Pension Enrollments
- Links a user to a pension package
- **sponsored_by**: References the user who recruited them for this specific pension
- Tracks payment progress and status
- One user can have multiple pension enrollments

### 1.3 Pension Package Roles
- Defines the role within the pension system (NOT project-specific)
- **Roles**:
  - `general_member`: Default role for all enrolled members
  - `executive_member`: Leadership role with team management responsibilities
  - `project_presenter`: Higher leadership role
  - `assistant_pp`: Assistant to project presenter

**Key Rules**:
- Every enrollment MUST have `general_member` role
- Can have ONE additional leadership role (executive_member, project_presenter, or assistant_pp)
- Leadership roles determine commission eligibility

### 1.4 Team Collections
- **team_leader_id**: References a user with leadership role (EM or PP)
- Aggregates monthly collections from all team members under this leader
- Tracks:
  - Total collection amount
  - Membership fees collected
  - Pension installments collected
  - Lakh milestones reached (for commission calculation)

### 1.5 Team Member Contributions
- Links individual members to team collections
- Tracks each member's contribution to the team's monthly total
- Calculates contribution percentage for commission distribution

---

## 2. Hierarchy Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Company/Organization                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Project Presenter (PP)                          │
│  - Has pension_package_roles.role = 'project_presenter'     │
│  - Leads multiple teams                                      │
│  - Receives commissions from all downline                    │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Assistant PP (APP)     │  │   Assistant PP (APP)     │
│  - Supports PP           │  │  - Supports PP           │
│  - Manages sub-teams     │  │  - Manages sub-teams     │
└──────────────────────────┘  └──────────────────────────┘
            │                              │
    ┌───────┴───────┐              ┌──────┴──────┐
    ▼               ▼              ▼             ▼
┌─────────┐   ┌─────────┐    ┌─────────┐   ┌─────────┐
│   EM    │   │   EM    │    │   EM    │   │   EM    │
│ (Team   │   │ (Team   │    │ (Team   │   │ (Team   │
│ Leader) │   │ Leader) │    │ Leader) │   │ Leader) │
└─────────┘   └─────────┘    └─────────┘   └─────────┘
     │             │               │             │
  ┌──┴──┐       ┌──┴──┐        ┌──┴──┐       ┌──┴──┐
  ▼     ▼       ▼     ▼        ▼     ▼       ▼     ▼
┌───┐ ┌───┐   ┌───┐ ┌───┐    ┌───┐ ┌───┐   ┌───┐ ┌───┐
│GM │ │GM │   │GM │ │GM │    │GM │ │GM │   │GM │ │GM │
└───┘ └───┘   └───┘ └───┘    └───┘ └───┘   └───┘ └───┘
```

**Legend**:
- **PP**: Project Presenter
- **APP**: Assistant Project Presenter
- **EM**: Executive Member (Team Leader)
- **GM**: General Member

---

## 3. How to Determine Hierarchy

### 3.1 Finding Who is Under Who

```sql
-- Find all users sponsored by a specific user
SELECT u.id, u.email, mp.name_english, u.sponsor_id
FROM users u
LEFT JOIN member_profiles mp ON u.id = mp.user_id
WHERE u.sponsor_id = :user_id;

-- Find a user's role in pension system
SELECT 
    pe.id as enrollment_id,
    pe.user_id,
    pp.name as package_name,
    ppr.role,
    ppr.is_active
FROM pension_enrollments pe
JOIN pension_packages pp ON pe.pension_package_id = pp.id
LEFT JOIN pension_package_roles ppr ON pe.id = ppr.pension_enrollment_id
WHERE pe.user_id = :user_id
AND ppr.is_active = 1;

-- Find all team members under an Executive Member
SELECT 
    tc.team_leader_id,
    tmc.member_id,
    u.email,
    mp.name_english,
    tmc.total_contribution,
    tmc.commission_earned
FROM team_collections tc
JOIN team_member_contributions tmc ON tc.id = tmc.team_collection_id
JOIN users u ON tmc.member_id = u.id
LEFT JOIN member_profiles mp ON u.id = mp.user_id
WHERE tc.team_leader_id = :executive_member_id
AND tc.period_month = :month;
```

### 3.2 Building the Tree Structure

**Algorithm**:
1. Start with a user
2. Check their `pension_package_roles` to determine their leadership level
3. If they have `executive_member`, `project_presenter`, or `assistant_pp` role:
   - Query `team_collections` where `team_leader_id = user_id`
   - Get all `team_member_contributions` for those collections
   - These are their direct team members
4. For each team member, check if they also have leadership roles
5. Recursively build the tree

---

## 4. Commission System

### 4.1 Commission Types

Based on `commissions` table:

1. **joining_commission**
   - Paid when a new member enrolls in a pension package
   - Amount varies by package: 500/600/700 TK
   - Goes to the sponsor (user.sponsor_id)
   - One-time payment

2. **installment_commission**
   - Paid for each pension installment payment
   - Fixed: 30 TK per installment
   - Goes to the sponsor
   - Recurring (up to 100 times per enrollment)

3. **team_commission**
   - Paid to Executive Members (EM) based on team performance
   - 10% commission per 1 lakh (100,000 TK) collected by team
   - Calculated monthly from `team_collections`
   - Formula: `(total_collection / 100000) * 10000`

4. **executive_commission**
   - Paid to higher-level leaders (PP, APP)
   - 5% of all commissions earned by their downline EMs
   - Hierarchical commission

5. **membership_commission**
   - Commission on membership fee collections
   - Tracked in `team_collections.membership_collection`

6. **referral_bonus**
   - Additional bonuses for meeting targets
   - Defined in `commission_rules`

### 4.2 Commission Flow

```
Member Makes Payment
        │
        ▼
┌───────────────────────────────────────┐
│  1. Direct Sponsor Commission         │
│     - joining_commission (one-time)   │
│     - installment_commission (30 TK)  │
│     → Goes to users.sponsor_id        │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  2. Team Collection Update            │
│     - Add to team_collections         │
│     - Update team_member_contributions│
│     - Calculate lakh milestones       │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  3. Team Leader Commission (EM)       │
│     - team_commission                 │
│     - 10% per lakh milestone          │
│     → Goes to team_leader_id          │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  4. Upline Commission (PP/APP)        │
│     - executive_commission            │
│     - 5% of EM's total commission     │
│     → Goes to EM's sponsor            │
└───────────────────────────────────────┘
```

### 4.3 Commission Calculation Example

**Scenario**: 
- User A (General Member) pays 1000 TK pension installment
- User A is sponsored by User B (Executive Member)
- User B is sponsored by User C (Project Presenter)

**Commissions Generated**:

1. **Installment Commission** (Direct Sponsor)
   - User B receives: 30 TK
   - Type: `installment_commission`
   - Source: User A's payment

2. **Team Collection** (Monthly Aggregate)
   - User B's team collects 150,000 TK this month
   - Lakh milestones: 1 (crossed 100,000)
   - User B receives: 10,000 TK (10% of 100,000)
   - Type: `team_commission`

3. **Executive Commission** (Upline)
   - User B earned total: 30 + 10,000 = 10,030 TK
   - User C receives: 5% of 10,030 = 501.50 TK
   - Type: `executive_commission`

---

## 5. Commission Rules System

The `commission_rules` table defines flexible commission structures:

### 5.1 Rule Types

1. **referral**: One-time bonus for recruiting
2. **milestone**: Bonus when team reaches collection targets
3. **position**: Role-based recurring commission
4. **package**: Package-specific commission rates
5. **hierarchy**: Downline commission (5% of team's earnings)

### 5.2 Example Rules

```sql
-- Rule: EM gets 10% per lakh
INSERT INTO commission_rules VALUES (
    name: '1 Lakh Milestone',
    rule_type: 'milestone',
    role_slug: 'em',
    min_collection: 100000,
    commission_type: 'percentage',
    commission_value: 10.00,
    is_active: true
);

-- Rule: PP gets 5% of downline commissions
INSERT INTO commission_rules VALUES (
    name: 'PP Hierarchy Commission',
    rule_type: 'hierarchy',
    role_slug: 'pp',
    commission_type: 'percentage',
    commission_value: 5.00,
    is_active: true
);
```

---

## 6. Frontend Display Structure

### 6.1 Hierarchy Tree Component

```javascript
// API Endpoint: GET /api/v1/users/{id}/hierarchy
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "project_presenter",
    "total_team_size": 45,
    "direct_referrals": 5
  },
  "downline": [
    {
      "id": 2,
      "name": "Jane Smith",
      "role": "executive_member",
      "level": 1,
      "team_size": 10,
      "monthly_collection": 150000,
      "children": [
        {
          "id": 3,
          "name": "Bob Johnson",
          "role": "general_member",
          "level": 2,
          "monthly_contribution": 1000,
          "children": []
        }
      ]
    }
  ]
}
```

### 6.2 Commission Dashboard

```javascript
// API Endpoint: GET /api/v1/users/{id}/commissions/summary
{
  "total_earned": 50000,
  "pending": 5000,
  "credited": 45000,
  "breakdown": {
    "joining_commission": 3500,
    "installment_commission": 15000,
    "team_commission": 25000,
    "executive_commission": 6500
  },
  "monthly_trend": [
    {"month": "2024-01", "amount": 10000},
    {"month": "2024-02", "amount": 12000}
  ]
}
```

### 6.3 Team Performance View

```javascript
// API Endpoint: GET /api/v1/team-collections/{team_leader_id}
{
  "team_leader": {
    "id": 2,
    "name": "Jane Smith",
    "role": "executive_member"
  },
  "current_month": {
    "period": "2024-03",
    "total_collection": 150000,
    "lakh_milestones": 1,
    "commission_earned": 10000,
    "team_members": 10,
    "active_contributors": 8
  },
  "members": [
    {
      "id": 3,
      "name": "Bob Johnson",
      "contribution": 15000,
      "percentage": 10.0,
      "commission_share": 1000
    }
  ]
}
```

---

## 7. Key Queries for Frontend

### 7.1 Get User's Position in Hierarchy

```sql
SELECT 
    u.id,
    u.email,
    mp.name_english,
    ppr.role as pension_role,
    u.sponsor_id,
    sponsor.email as sponsor_email,
    sponsor_mp.name_english as sponsor_name
FROM users u
LEFT JOIN member_profiles mp ON u.id = mp.user_id
LEFT JOIN pension_enrollments pe ON u.id = pe.user_id
LEFT JOIN pension_package_roles ppr ON pe.id = ppr.pension_enrollment_id AND ppr.is_active = 1
LEFT JOIN users sponsor ON u.sponsor_id = sponsor.id
LEFT JOIN member_profiles sponsor_mp ON sponsor.id = sponsor_mp.user_id
WHERE u.id = :user_id;
```

### 7.2 Get Direct Team Members

```sql
SELECT 
    u.id,
    mp.name_english,
    u.email,
    ppr.role,
    COUNT(DISTINCT pe.id) as total_enrollments,
    SUM(pe.total_amount_paid) as total_contributed
FROM users u
LEFT JOIN member_profiles mp ON u.id = mp.user_id
LEFT JOIN pension_enrollments pe ON u.id = pe.user_id
LEFT JOIN pension_package_roles ppr ON pe.id = ppr.pension_enrollment_id AND ppr.is_active = 1
WHERE u.sponsor_id = :user_id
GROUP BY u.id;
```

### 7.3 Get Team Collection Summary

```sql
SELECT 
    tc.period_month,
    tc.total_collection,
    tc.lakh_milestones_reached,
    tc.commission_eligible_amount,
    tc.team_member_count,
    tc.active_contributors,
    SUM(c.amount) as total_commission_paid
FROM team_collections tc
LEFT JOIN commissions c ON c.user_id = tc.team_leader_id 
    AND c.type = 'team_commission'
    AND c.status = 'credited'
WHERE tc.team_leader_id = :user_id
GROUP BY tc.id
ORDER BY tc.period_month DESC;
```

### 7.4 Get Commission History

```sql
SELECT 
    c.id,
    c.type,
    c.amount,
    c.status,
    c.created_at,
    c.source_type,
    source_user.email as source_email,
    source_mp.name_english as source_name,
    c.description
FROM commissions c
LEFT JOIN users source_user ON c.source_user_id = source_user.id
LEFT JOIN member_profiles source_mp ON source_user.id = source_mp.user_id
WHERE c.user_id = :user_id
ORDER BY c.created_at DESC;
```

---

## 8. Business Logic Implementation

### 8.1 When a Payment is Made

```php
// 1. Record the payment
$payment = Payment::create([...]);

// 2. Update pension enrollment
$enrollment->installments_paid++;
$enrollment->total_amount_paid += $amount;
$enrollment->save();

// 3. Create direct sponsor commission
if ($enrollment->sponsored_by) {
    Commission::create([
        'user_id' => $enrollment->sponsored_by,
        'type' => 'installment_commission',
        'amount' => 30,
        'source_type' => 'PensionInstallment',
        'source_id' => $installment->id,
        'source_user_id' => $enrollment->user_id,
        'status' => 'pending'
    ]);
}

// 4. Update team collection
$teamLeader = findTeamLeader($enrollment->user_id);
if ($teamLeader) {
    updateTeamCollection($teamLeader, $amount, $period);
}

// 5. Check for milestone commissions
checkAndCreateMilestoneCommissions($teamLeader, $period);

// 6. Create upline commissions
createUplineCommissions($teamLeader);
```

### 8.2 Finding Team Leader

```php
function findTeamLeader($userId) {
    // Find the user's sponsor
    $sponsor = User::find($userId)->sponsor;
    
    if (!$sponsor) return null;
    
    // Check if sponsor has leadership role
    $hasLeadershipRole = PensionPackageRole::where('pension_enrollment_id', function($q) use ($sponsor) {
        $q->select('id')
          ->from('pension_enrollments')
          ->where('user_id', $sponsor->id)
          ->where('status', 'active');
    })
    ->whereIn('role', ['executive_member', 'project_presenter', 'assistant_pp'])
    ->where('is_active', true)
    ->exists();
    
    if ($hasLeadershipRole) {
        return $sponsor;
    }
    
    // Recursively check sponsor's sponsor
    return findTeamLeader($sponsor->id);
}
```

### 8.3 Calculating Team Commission

```php
function calculateTeamCommission($teamLeaderId, $periodMonth) {
    $collection = TeamCollection::where('team_leader_id', $teamLeaderId)
        ->where('period_month', $periodMonth)
        ->first();
    
    if (!$collection) return;
    
    // Calculate lakh milestones
    $lakhsReached = floor($collection->total_collection / 100000);
    
    if ($lakhsReached > $collection->lakh_milestones_reached) {
        $newMilestones = $lakhsReached - $collection->lakh_milestones_reached;
        $commissionAmount = $newMilestones * 10000; // 10% of 1 lakh
        
        // Create commission
        Commission::create([
            'user_id' => $teamLeaderId,
            'type' => 'team_commission',
            'amount' => $commissionAmount,
            'base_amount' => $newMilestones * 100000,
            'percentage' => 10,
            'source_type' => 'TeamCollection',
            'source_id' => $collection->id,
            'status' => 'pending'
        ]);
        
        // Update collection
        $collection->update([
            'lakh_milestones_reached' => $lakhsReached,
            'commission_eligible_amount' => $lakhsReached * 100000
        ]);
    }
}
```

---

## 9. Frontend Implementation Guide

### 9.1 Hierarchy Tree Component (React Example)

```jsx
import React from 'react';
import { Tree } from 'antd';

const HierarchyTree = ({ userId }) => {
  const [treeData, setTreeData] = useState([]);
  
  useEffect(() => {
    fetch(`/api/v1/users/${userId}/hierarchy`)
      .then(res => res.json())
      .then(data => {
        setTreeData(buildTreeData(data));
      });
  }, [userId]);
  
  const buildTreeData = (node) => {
    return {
      title: (
        <div>
          <strong>{node.name}</strong>
          <span className="role-badge">{node.role}</span>
          <span>Team: {node.team_size}</span>
        </div>
      ),
      key: node.id,
      children: node.children?.map(buildTreeData) || []
    };
  };
  
  return <Tree treeData={treeData} />;
};
```

### 9.2 Commission Dashboard

```jsx
const CommissionDashboard = ({ userId }) => {
  const [summary, setSummary] = useState(null);
  
  useEffect(() => {
    fetch(`/api/v1/users/${userId}/commissions/summary`)
      .then(res => res.json())
      .then(setSummary);
  }, [userId]);
  
  return (
    <div className="commission-dashboard">
      <div className="total-earned">
        <h2>Total Earned: {summary?.total_earned} TK</h2>
        <p>Pending: {summary?.pending} TK</p>
        <p>Credited: {summary?.credited} TK</p>
      </div>
      
      <div className="breakdown">
        <h3>Commission Breakdown</h3>
        {Object.entries(summary?.breakdown || {}).map(([type, amount]) => (
          <div key={type}>
            <span>{type}</span>
            <span>{amount} TK</span>
          </div>
        ))}
      </div>
      
      <div className="trend-chart">
        <LineChart data={summary?.monthly_trend} />
      </div>
    </div>
  );
};
```

---

## 10. API Endpoints Needed

### 10.1 Hierarchy APIs

```
GET /api/v1/users/{id}/hierarchy
GET /api/v1/users/{id}/downline
GET /api/v1/users/{id}/upline
GET /api/v1/users/{id}/team-members
```

### 10.2 Commission APIs

```
GET /api/v1/users/{id}/commissions
GET /api/v1/users/{id}/commissions/summary
GET /api/v1/users/{id}/commissions/pending
POST /api/v1/commissions/{id}/approve
POST /api/v1/commissions/{id}/reject
```

### 10.3 Team Collection APIs

```
GET /api/v1/teamcollections                          # List all (existing)
GET /api/v1/teamcollections?team_leader_id={id}      # Filter by leader
GET /api/v1/teamcollections?period_month=2024-03     # Filter by month
GET /api/v1/teamcollection/{id}                      # Get specific collection
```

### 10.4 Team Member Contribution APIs

```
GET /api/v1/teammembercontributions                           # List all (existing)
GET /api/v1/teammembercontributions?team_collection_id={id}   # Filter by collection
GET /api/v1/teammembercontributions?member_id={id}            # Filter by member
GET /api/v1/teammembercontribution/{id}                       # Get specific contribution
```

---

## 11. Complete Frontend Display Examples

### 11.1 Team Collection Dashboard (For Team Leaders)

This shows the team leader's monthly performance with all member contributions:

```jsx
const TeamCollectionDashboard = ({ teamLeaderId }) => {
  const [collections, setCollections] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [memberContributions, setMemberContributions] = useState([]);
  
  useEffect(() => {
    // Fetch team collections for this leader
    fetch(`/api/v1/teamcollections?team_leader_id=${teamLeaderId}`)
      .then(res => res.json())
      .then(data => setCollections(data.data));
  }, [teamLeaderId]);
  
  const loadMemberContributions = (collectionId) => {
    fetch(`/api/v1/teammembercontributions?team_collection_id=${collectionId}`)
      .then(res => res.json())
      .then(data => setMemberContributions(data.data));
  };
  
  return (
    <div className="team-collection-dashboard">
      <h2>Team Performance</h2>
      
      {/* Monthly Collections Summary */}
      <div className="collections-list">
        {collections.map(collection => (
          <div 
            key={collection.id} 
            className="collection-card"
            onClick={() => {
              setSelectedMonth(collection);
              loadMemberContributions(collection.id);
            }}
          >
            <h3>{collection.period_month}</h3>
            <div className="stats">
              <div>
                <label>Total Collection</label>
                <strong>{collection.total_collection} TK</strong>
              </div>
              <div>
                <label>Membership Fees</label>
                <span>{collection.membership_collection} TK</span>
              </div>
              <div>
                <label>Pension Installments</label>
                <span>{collection.pension_collection} TK</span>
              </div>
              <div>
                <label>Lakh Milestones</label>
                <span>{collection.lakh_milestones_reached}</span>
              </div>
              <div>
                <label>Commission Eligible</label>
                <strong className="highlight">
                  {collection.commission_eligible_amount} TK
                </strong>
              </div>
              <div>
                <label>Team Members</label>
                <span>{collection.team_member_count}</span>
              </div>
              <div>
                <label>Active Contributors</label>
                <span>{collection.active_contributors}</span>
              </div>
            </div>
            {collection.commission_calculated && (
              <div className="badge success">
                Commission Calculated ✓
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Member Contributions Detail */}
      {selectedMonth && (
        <div className="member-contributions">
          <h3>Member Contributions - {selectedMonth.period_month}</h3>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Total Contribution</th>
                <th>Membership</th>
                <th>Pension</th>
                <th>Contribution %</th>
                <th>Commission Earned</th>
              </tr>
            </thead>
            <tbody>
              {memberContributions.map(contrib => (
                <tr key={contrib.id}>
                  <td>
                    <div className="member-info">
                      <strong>{contrib.member?.member?.name_english}</strong>
                      <small>{contrib.member?.email}</small>
                    </div>
                  </td>
                  <td><strong>{contrib.total_contribution} TK</strong></td>
                  <td>{contrib.membership_contribution} TK</td>
                  <td>{contrib.pension_contribution} TK</td>
                  <td>{contrib.contribution_percentage}%</td>
                  <td className="highlight">
                    {contrib.commission_earned} TK
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{selectedMonth.total_collection} TK</strong></td>
                <td>{selectedMonth.membership_collection} TK</td>
                <td>{selectedMonth.pension_collection} TK</td>
                <td>100%</td>
                <td className="highlight">
                  <strong>
                    {memberContributions.reduce((sum, c) => 
                      sum + parseFloat(c.commission_earned), 0
                    )} TK
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
```

### 11.2 Member's Contribution History

This shows an individual member's contributions across different teams/months:

```jsx
const MemberContributionHistory = ({ memberId }) => {
  const [contributions, setContributions] = useState([]);
  
  useEffect(() => {
    fetch(`/api/v1/teammembercontributions?member_id=${memberId}`)
      .then(res => res.json())
      .then(data => setContributions(data.data));
  }, [memberId]);
  
  return (
    <div className="contribution-history">
      <h2>My Contribution History</h2>
      
      <div className="summary-cards">
        <div className="card">
          <label>Total Contributed</label>
          <h3>
            {contributions.reduce((sum, c) => 
              sum + parseFloat(c.total_contribution), 0
            )} TK
          </h3>
        </div>
        <div className="card">
          <label>Total Commission Earned</label>
          <h3>
            {contributions.reduce((sum, c) => 
              sum + parseFloat(c.commission_earned), 0
            )} TK
          </h3>
        </div>
        <div className="card">
          <label>Months Active</label>
          <h3>{contributions.length}</h3>
        </div>
      </div>
      
      <table className="contribution-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Team Leader</th>
            <th>My Contribution</th>
            <th>Team Total</th>
            <th>My Share %</th>
            <th>Commission Earned</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map(contrib => (
            <tr key={contrib.id}>
              <td>{contrib.team_collection?.period_month}</td>
              <td>
                {contrib.team_collection?.team_leader?.member?.name_english}
              </td>
              <td>{contrib.total_contribution} TK</td>
              <td>{contrib.team_collection?.total_collection} TK</td>
              <td>{contrib.contribution_percentage}%</td>
              <td className="highlight">{contrib.commission_earned} TK</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 11.3 Complete Hierarchy with Team Collections

This combines the hierarchy tree with team collection data:

```jsx
const CompleteHierarchyView = ({ userId }) => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  useEffect(() => {
    loadHierarchyWithCollections(userId);
  }, [userId]);
  
  const loadHierarchyWithCollections = async (uid) => {
    // Load user hierarchy
    const hierarchyRes = await fetch(`/api/v1/users/${uid}/hierarchy`);
    const hierarchy = await hierarchyRes.json();
    
    // For each user with leadership role, load their team collections
    const enrichedHierarchy = await enrichWithCollections(hierarchy);
    setHierarchyData(enrichedHierarchy);
  };
  
  const enrichWithCollections = async (node) => {
    // Check if user has leadership role
    if (['executive_member', 'project_presenter', 'assistant_pp'].includes(node.role)) {
      // Load their team collections
      const collectionsRes = await fetch(
        `/api/v1/teamcollections?team_leader_id=${node.id}&period_month=${getCurrentMonth()}`
      );
      const collections = await collectionsRes.json();
      node.currentMonthCollection = collections.data[0] || null;
      
      // Load member contributions if collection exists
      if (node.currentMonthCollection) {
        const contribRes = await fetch(
          `/api/v1/teammembercontributions?team_collection_id=${node.currentMonthCollection.id}`
        );
        const contributions = await contribRes.json();
        node.currentMonthCollection.contributions = contributions.data;
      }
    }
    
    // Recursively enrich children
    if (node.children) {
      node.children = await Promise.all(
        node.children.map(child => enrichWithCollections(child))
      );
    }
    
    return node;
  };
  
  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isLeader = ['executive_member', 'project_presenter', 'assistant_pp']
      .includes(node.role);
    
    return (
      <div key={node.id} className="hierarchy-node" style={{ marginLeft: level * 30 }}>
        <div className="node-header">
          {hasChildren && (
            <button 
              onClick={() => {
                const newExpanded = new Set(expandedNodes);
                if (isExpanded) {
                  newExpanded.delete(node.id);
                } else {
                  newExpanded.add(node.id);
                }
                setExpandedNodes(newExpanded);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          
          <div className="node-info">
            <div className="user-details">
              <strong>{node.name}</strong>
              <span className={`role-badge ${node.role}`}>
                {node.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="stats">
              <span>Team Size: {node.team_size}</span>
              <span>Direct Referrals: {node.direct_referrals}</span>
            </div>
            
            {/* Show team collection data for leaders */}
            {isLeader && node.currentMonthCollection && (
              <div className="collection-summary">
                <div className="collection-stats">
                  <div>
                    <label>This Month Collection</label>
                    <strong>{node.currentMonthCollection.total_collection} TK</strong>
                  </div>
                  <div>
                    <label>Lakh Milestones</label>
                    <strong>{node.currentMonthCollection.lakh_milestones_reached}</strong>
                  </div>
                  <div>
                    <label>Team Members</label>
                    <strong>{node.currentMonthCollection.team_member_count}</strong>
                  </div>
                  <div>
                    <label>Active Contributors</label>
                    <strong>{node.currentMonthCollection.active_contributors}</strong>
                  </div>
                </div>
                
                {/* Show top contributors */}
                {node.currentMonthCollection.contributions && (
                  <div className="top-contributors">
                    <label>Top Contributors:</label>
                    <ul>
                      {node.currentMonthCollection.contributions
                        .sort((a, b) => b.total_contribution - a.total_contribution)
                        .slice(0, 3)
                        .map(contrib => (
                          <li key={contrib.id}>
                            {contrib.member?.member?.name_english}: {contrib.total_contribution} TK
                            ({contrib.contribution_percentage}%)
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <div className="node-children">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="complete-hierarchy-view">
      <h2>Organization Hierarchy with Team Performance</h2>
      {hierarchyData && renderNode(hierarchyData)}
    </div>
  );
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
```

### 11.4 Team Collection Analytics Dashboard

```jsx
const TeamAnalyticsDashboard = ({ teamLeaderId }) => {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    loadAnalytics();
  }, [teamLeaderId]);
  
  const loadAnalytics = async () => {
    // Fetch all collections for this leader
    const collectionsRes = await fetch(
      `/api/v1/teamcollections?team_leader_id=${teamLeaderId}`
    );
    const collections = await collectionsRes.json();
    
    // Calculate analytics
    const data = collections.data;
    const analytics = {
      totalMonths: data.length,
      totalCollected: data.reduce((sum, c) => sum + parseFloat(c.total_collection), 0),
      avgMonthlyCollection: data.reduce((sum, c) => sum + parseFloat(c.total_collection), 0) / data.length,
      totalLakhMilestones: data.reduce((sum, c) => sum + c.lakh_milestones_reached, 0),
      totalCommissionEligible: data.reduce((sum, c) => sum + parseFloat(c.commission_eligible_amount), 0),
      avgTeamSize: data.reduce((sum, c) => sum + c.team_member_count, 0) / data.length,
      avgActiveContributors: data.reduce((sum, c) => sum + c.active_contributors, 0) / data.length,
      monthlyTrend: data.map(c => ({
        month: c.period_month,
        collection: parseFloat(c.total_collection),
        members: c.team_member_count,
        active: c.active_contributors
      }))
    };
    
    setAnalytics(analytics);
  };
  
  return (
    <div className="team-analytics">
      <h2>Team Analytics</h2>
      
      <div className="kpi-grid">
        <div className="kpi-card">
          <label>Total Collected</label>
          <h3>{analytics?.totalCollected.toLocaleString()} TK</h3>
          <small>Across {analytics?.totalMonths} months</small>
        </div>
        
        <div className="kpi-card">
          <label>Avg Monthly Collection</label>
          <h3>{analytics?.avgMonthlyCollection.toLocaleString()} TK</h3>
        </div>
        
        <div className="kpi-card">
          <label>Total Lakh Milestones</label>
          <h3>{analytics?.totalLakhMilestones}</h3>
          <small>Commission: {analytics?.totalLakhMilestones * 10000} TK</small>
        </div>
        
        <div className="kpi-card">
          <label>Avg Team Size</label>
          <h3>{Math.round(analytics?.avgTeamSize)}</h3>
          <small>Avg Active: {Math.round(analytics?.avgActiveContributors)}</small>
        </div>
      </div>
      
      <div className="charts">
        <div className="chart">
          <h4>Monthly Collection Trend</h4>
          <LineChart 
            data={analytics?.monthlyTrend}
            xKey="month"
            yKey="collection"
          />
        </div>
        
        <div className="chart">
          <h4>Team Growth</h4>
          <LineChart 
            data={analytics?.monthlyTrend}
            xKey="month"
            lines={[
              { key: 'members', label: 'Total Members', color: '#3b82f6' },
              { key: 'active', label: 'Active Contributors', color: '#10b981' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};
```

---

## Summary

The system creates a multi-level marketing structure where:

1. **Users** are connected via `sponsor_id` (referral tree)
2. **Pension Enrollments** link users to packages
3. **Pension Package Roles** define leadership levels
4. **Team Collections** aggregate monthly performance
5. **Team Member Contributions** track individual contributions
6. **Commissions** are calculated based on:
   - Direct referrals (joining + installment)
   - Team performance (milestone-based)
   - Downline earnings (hierarchical)

The frontend should display this as a tree structure showing who recruited whom, their roles, team performance, and commission earnings at each level.
