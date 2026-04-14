# Commission API Integration Guide

## Overview
This document describes the commission API endpoints that have been integrated into the pension team management system.

## API Endpoints

### 1. Get My Commissions
**Endpoint:** `GET /api/v1/my-commissions`

**Description:** Fetches all commissions for the current user with pagination and filtering options.

**Query Parameters:**
- `type` (optional) - Filter by commission type (e.g., `joining_commission`, `installment_commission`, `team_commission`)
- `status` (optional) - Filter by status (`pending`, `approved`, `credited`, `rejected`)
- `per_page` (optional) - Items per page (default: 15)
- `page` (optional) - Page number (default: 1)

**Response Example:**
```json
{
  "success": true,
  "message": "My commissions fetched successfully.",
  "data": [
    {
      "id": 1,
      "type": "installment_commission",
      "amount": 30.00,
      "status": "credited",
      "description": "Installment #5 commission",
      "source_user": {
        "id": 25,
        "name": "John Doe"
      },
      "wallet_transaction_id": 123,
      "created_at": "2026-04-10 10:00:00"
    }
  ],
  "pagination": {
    "total": 45,
    "per_page": 15,
    "current_page": 1,
    "last_page": 3
  }
}
```

### 2. Get My Commission Stats
**Endpoint:** `GET /api/v1/my-commission-stats`

**Description:** Fetches commission statistics for the current user with optional month filtering.

**Query Parameters:**
- `month` (optional) - Month in YYYY-MM format (e.g., `2026-04`). If not provided, returns all-time stats.

**Response Example:**
```json
{
  "success": true,
  "message": "Commission statistics fetched successfully.",
  "data": {
    "period": "2026-04",
    "summary": {
      "total_commissions": 1500.00,
      "total_count": 45,
      "credited_amount": 1200.00,
      "pending_amount": 200.00,
      "approved_amount": 100.00
    },
    "by_type": {
      "installment_commission": {
        "total": 900.00,
        "count": 30
      },
      "team_commission": {
        "total": 450.00,
        "count": 10
      },
      "joining_commission": {
        "total": 150.00,
        "count": 5
      }
    },
    "by_status": {
      "credited": {
        "total": 1200.00,
        "count": 38
      },
      "approved": {
        "total": 100.00,
        "count": 3
      },
      "pending": {
        "total": 200.00,
        "count": 4
      }
    }
  }
}
```

## Frontend Integration

### API Functions
Location: `lib/api/functions/user/pensionTeamApi.ts`

**Functions:**
- `getMyCommissions(params?: CommissionsParams)` - Fetch paginated commissions list
- `getMyCommissionStats(month?: string)` - Fetch commission statistics

### React Hooks
Location: `lib/hooks/user/usePensionTeam.ts`

**Hooks:**
- `useMyCommissions(params?)` - React Query hook for commissions list
- `useMyCommissionStats(month?)` - React Query hook for commission stats

### Usage Example

```typescript
import { useMyCommissions, useMyCommissionStats } from "@/lib/hooks";

function CommissionsPage() {
  const selectedMonth = "2026-04";
  
  // Fetch commission statistics
  const { data: statsData, isLoading: loadingStats } = useMyCommissionStats(selectedMonth);
  
  // Fetch recent commissions
  const { data: commissionsData, isLoading: loadingCommissions } = useMyCommissions({
    per_page: 10,
    page: 1
  });
  
  const stats = statsData?.data;
  const commissions = commissionsData?.data || [];
  
  return (
    <div>
      <h2>Total Earned: ৳{stats?.summary.total_commissions}</h2>
      <ul>
        {commissions.map(commission => (
          <li key={commission.id}>
            {commission.description} - ৳{commission.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## UI Implementation

### Location
`app/(auth)/dashboard/pensions/team/page.tsx` - Commissions Tab

### Features Implemented

1. **Summary Cards**
   - Total Earned (all commissions)
   - Credited Amount (paid to wallet)
   - Pending Amount (awaiting approval)

2. **Commission by Type Table**
   - Shows breakdown by commission type
   - Displays count and total amount per type

3. **Commission by Status Table**
   - Shows breakdown by status (credited, approved, pending, rejected)
   - Visual status indicators with color coding

4. **Recent Commissions Table**
   - Lists recent commission transactions
   - Shows date, type, description, amount, and status
   - Displays source user information when available

5. **Empty State**
   - Friendly message when no commissions exist

6. **Loading State**
   - Spinner animation while fetching data

7. **Error State**
   - Fallback UI when API is not available
   - Shows required endpoint information

## Commission Types

- `joining_commission` - Commission from new team member enrollments
- `installment_commission` - Commission from monthly installment payments
- `team_commission` - Commission from team performance
- Other custom types as defined by backend

## Commission Statuses

- `pending` - Awaiting approval (Yellow badge)
- `approved` - Approved but not yet credited (Blue badge)
- `credited` - Paid to wallet (Green badge)
- `rejected` - Rejected commission (Red badge)

## Data Flow

1. User selects month from dropdown
2. `useMyCommissionStats(month)` fetches statistics for selected month
3. `useMyCommissions()` fetches recent commission transactions
4. Data is displayed in organized tables and cards
5. Month selector updates trigger automatic refetch

## Caching Strategy

- Commission stats: 3 minutes stale time
- Commissions list: 2 minutes stale time
- Automatic refetch on window focus
- Manual refetch available via React Query

## Future Enhancements

- Pagination for commissions list
- Export commission reports
- Filter by commission type and status
- Date range selector
- Commission growth charts
- Detailed commission breakdown modal
