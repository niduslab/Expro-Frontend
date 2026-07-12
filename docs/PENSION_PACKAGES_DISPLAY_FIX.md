# Pension Packages Display Fix

## Issue
Pension packages were not displaying on the `/admin/pension-packages` page despite data being returned from the API.

## Root Causes

### 1. Incorrect Data Access Path
The page was trying to access `packagesData?.data?.data` but the actual API response structure is:
```json
{
  "success": true,
  "message": "Pension packages data fetches successfully",
  "data": [...],  // Array directly here
  "pagination": {...}
}
```

### 2. Missing Field: `duration_months`
The page was trying to display `plan.duration_months` which doesn't exist in the backend response. The backend provides `total_installments` instead.

### 3. Status Mismatch
The backend returns status as "running" but the status badge mapping only had "active", "inactive", and "upcoming".

## Changes Made

### 1. Updated API Response Type (`lib/api/axios.ts`)
```typescript
export interface PaginatedResponse<T = any> {
  success: boolean;
  message?: string;
  data: T[];  // Changed from nested structure
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
```

### 2. Fixed Data Access (`app/(auth)/admin/pension-packages/page.tsx`)
```typescript
// Before
const packagesArray = packagesData?.data?.data;

// After
const packagesArray = packagesData?.data;
```

### 3. Fixed Duration Display
```typescript
// Before
<Stat
  icon={<Calendar size={14} />}
  label="Duration"
  value={`${Math.floor(plan.duration_months / 12)} Years (${plan.duration_months} inst.)`}
/>

// After
<Stat
  icon={<Calendar size={14} />}
  label="Total Installments"
  value={`${plan.total_installments} months`}
/>
```

### 4. Updated Status Badge Mapping
```typescript
const statusMap: Record<string, { text: string; className: string }> = {
  running: { text: "Running", className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]" },
  active: { text: "Running", className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]" },
  inactive: { text: "Expired", className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]" },
  expired: { text: "Expired", className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]" },
  upcoming: { text: "Upcoming", className: "text-[#F59E0B] bg-[#FEF3C7] border-[#FCD34D]" },
};
```

### 5. Added Safe Parsing for Numeric Values
```typescript
// Ensure proper number formatting
value={`৳${parseFloat(plan.maturity_amount)?.toLocaleString()}`}
value={`৳${parseFloat(plan.installment_commission) || 0}/inst`}
```

## Backend Data Format
```json
{
  "id": 1,
  "name": "adf",
  "name_bangla": "asdfasdf",
  "slug": "adf",
  "monthly_amount": "1111.00",
  "total_installments": 18,
  "maturity_amount": "18888.00",
  "joining_commission": "123.00",
  "installment_commission": "22.00",
  "status": "running",
  "is_active": true,
  "accepts_new_enrollment": true,
  "description": null,
  "terms_conditions": null,
  "created_at": "2026-03-29 10:42:05",
  "updated_at": "2026-03-29 10:42:05"
}
```

## Files Modified
1. `lib/api/axios.ts` - Updated PaginatedResponse interface
2. `app/(auth)/admin/pension-packages/page.tsx` - Fixed data access and display logic

## Result
Pension packages now display correctly with all the proper information from the backend.
