# Sponsor Hooks Usage Guide

## Overview
This guide explains how to use the sponsor-related React Query hooks for validating and searching sponsors in the membership registration process.

## Available Hooks

### 1. useValidateSponsor
Validates if a user is eligible to be a sponsor.

#### Signature
```typescript
useValidateSponsor(
  userId?: number,
  memberId?: string,
  enabled: boolean = false
)
```

#### Parameters
- `userId` (optional): User ID to validate
- `memberId` (optional): Member ID to validate
- `enabled` (default: false): Whether the query should run automatically

#### Returns
```typescript
{
  data: SponsorValidationResult | undefined,
  isLoading: boolean,
  error: Error | null,
  refetch: () => void
}
```

#### Usage Example

**Manual Validation (Recommended for forms)**
```typescript
const [shouldValidate, setShouldValidate] = useState(false);

const { 
  data: validationData, 
  isLoading: isVerifying,
  error: validationError 
} = useValidateSponsor(undefined, memberId, shouldValidate);

// Trigger validation on button click
const handleVerify = () => {
  setShouldValidate(true);
};

// Handle response
useEffect(() => {
  if (shouldValidate && validationData) {
    setShouldValidate(false);
    if (validationData.is_eligible) {
      console.log('Sponsor is eligible!');
    } else {
      console.log('Not eligible:', validationData.reason);
    }
  }
}, [validationData, shouldValidate]);
```

**Auto Validation**
```typescript
const { data, isLoading } = useValidateSponsor(123, undefined, true);

if (isLoading) return <div>Validating...</div>;
if (data?.is_eligible) return <div>Eligible sponsor!</div>;
```

---

### 2. useSearchSponsors
Search for sponsors by name, member ID, email, or phone.

#### Signature
```typescript
useSearchSponsors(
  params: SponsorSearchParams | null,
  enabled: boolean = false
)
```

#### Parameters
- `params`: Search parameters object
  ```typescript
  {
    query: string;        // Search term
    eligible_only?: boolean;  // Filter to eligible sponsors only
    limit?: number;       // Max results (default: 10)
  }
  ```
- `enabled` (default: false): Whether the query should run

#### Returns
```typescript
{
  data: SponsorSearchResult[],
  isLoading: boolean,
  error: Error | null
}
```

#### Usage Example

**Search on Button Click**
```typescript
const [searchParams, setSearchParams] = useState<SponsorSearchParams | null>(null);

const { 
  data: searchResults = [], 
  isLoading: isSearching 
} = useSearchSponsors(searchParams, !!searchParams);

const handleSearch = (query: string) => {
  setSearchParams({
    query,
    eligible_only: true,
    limit: 10
  });
};

// Clear search
const clearSearch = () => {
  setSearchParams(null);
};
```

**Search with Debounce**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

// Debounce effect
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);

const searchParams = debouncedQuery ? {
  query: debouncedQuery,
  eligible_only: true,
  limit: 10
} : null;

const { data: results, isLoading } = useSearchSponsors(
  searchParams, 
  !!searchParams
);
```

---

### 3. useSponsorDetails
Get complete information about a specific sponsor.

#### Signature
```typescript
useSponsorDetails(
  sponsorId?: number,
  enabled: boolean = true
)
```

#### Parameters
- `sponsorId`: User ID of the sponsor
- `enabled` (default: true): Whether the query should run

#### Returns
```typescript
{
  data: SponsorDetails | null,
  isLoading: boolean,
  error: Error | null
}
```

#### Usage Example

**Basic Usage**
```typescript
const { data: sponsor, isLoading } = useSponsorDetails(123);

if (isLoading) return <div>Loading sponsor details...</div>;
if (!sponsor) return <div>Sponsor not found</div>;

return (
  <div>
    <h2>{sponsor.name_english}</h2>
    <p>Member ID: {sponsor.member_id}</p>
    <p>Email: {sponsor.email}</p>
    <p>Sponsored Members: {sponsor.sponsored_members_count}</p>
  </div>
);
```

**Conditional Loading**
```typescript
const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(null);

const { data: sponsor, isLoading } = useSponsorDetails(
  selectedSponsorId || undefined,
  !!selectedSponsorId
);

// Load details when user selects a sponsor
const handleSelectSponsor = (id: number) => {
  setSelectedSponsorId(id);
};
```

---

## Complete Integration Example

Here's a complete example of using all hooks together in a sponsor selection form:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { 
  useValidateSponsor, 
  useSearchSponsors,
  useSponsorDetails,
  SponsorSearchParams 
} from '@/lib/hooks/public/useSponsor';

export default function SponsorSelectionForm() {
  // Form state
  const [memberId, setMemberId] = useState('');
  const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Control states
  const [shouldValidate, setShouldValidate] = useState(false);
  const [searchParams, setSearchParams] = useState<SponsorSearchParams | null>(null);

  // Hooks
  const { 
    data: validationData, 
    isLoading: isValidating 
  } = useValidateSponsor(undefined, memberId, shouldValidate);

  const { 
    data: searchResults = [], 
    isLoading: isSearching 
  } = useSearchSponsors(searchParams, !!searchParams);

  const { 
    data: sponsorDetails 
  } = useSponsorDetails(selectedSponsorId || undefined, !!selectedSponsorId);

  // Handle validation response
  useEffect(() => {
    if (shouldValidate && validationData) {
      setShouldValidate(false);
      if (validationData.is_eligible) {
        setSelectedSponsorId(validationData.user_id);
        alert('Sponsor verified successfully!');
      } else {
        alert(`Not eligible: ${validationData.reason}`);
      }
    }
  }, [validationData, shouldValidate]);

  // Handlers
  const handleVerify = () => {
    if (memberId.trim()) {
      setShouldValidate(true);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({
        query: searchQuery,
        eligible_only: true,
        limit: 10
      });
    }
  };

  const handleSelectFromSearch = (userId: number, memberIdValue: string) => {
    setMemberId(memberIdValue);
    setSearchParams(null);
    setSearchQuery('');
    // Auto-verify
    setTimeout(() => setShouldValidate(true), 100);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div>
        <h3>Search for Sponsor</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, email..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 border rounded">
            {searchResults.map((result) => (
              <button
                key={result.user_id}
                onClick={() => handleSelectFromSearch(result.user_id, result.member_id)}
                className="w-full p-3 text-left hover:bg-gray-50"
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-gray-600">
                  {result.member_id} • {result.email}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Manual Entry Section */}
      <div>
        <h3>Or Enter Member ID</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="e.g., EXP001"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button 
            onClick={handleVerify}
            disabled={isValidating}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {isValidating ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Sponsor Details */}
      {sponsorDetails && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold">{sponsorDetails.name_english}</h4>
          <p>Member ID: {sponsorDetails.member_id}</p>
          <p>Email: {sponsorDetails.email}</p>
          <p>Mobile: {sponsorDetails.mobile}</p>
          <p>Sponsored Members: {sponsorDetails.sponsored_members_count}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Use `enabled` Parameter
Always control when queries run using the `enabled` parameter to avoid unnecessary API calls:

```typescript
// ❌ Bad - Runs immediately even with empty memberId
const { data } = useValidateSponsor(undefined, memberId, true);

// ✅ Good - Only runs when explicitly triggered
const { data } = useValidateSponsor(undefined, memberId, shouldValidate);
```

### 2. Handle Loading States
Always show loading indicators for better UX:

```typescript
if (isLoading) {
  return <Spinner />;
}
```

### 3. Handle Errors
Check for errors and display appropriate messages:

```typescript
if (error) {
  return <ErrorMessage message={error.message} />;
}
```

### 4. Reset State Appropriately
Clear search results and validation data when needed:

```typescript
const handleClear = () => {
  setSearchParams(null);
  setSearchQuery('');
  setShouldValidate(false);
};
```

### 5. Use React Query DevTools
Install React Query DevTools for debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

---

## Type Definitions

### SponsorValidationResult
```typescript
interface SponsorValidationResult {
  is_eligible: boolean;
  reason: string;
  user_id: number;
  member_id: string;
  name: string;
  email: string;
  mobile: string;
  pension_roles: string[];
  system_roles: string[];
  pension_enrollments: PensionEnrollment[];
}
```

### SponsorSearchResult
```typescript
interface SponsorSearchResult {
  user_id: number;
  member_id: string;
  name: string;
  email: string;
  mobile: string;
  is_eligible: boolean;
  eligibility_reason?: string;
}
```

### SponsorDetails
```typescript
interface SponsorDetails {
  user_id: number;
  member_id: string;
  name_english: string;
  name_bangla?: string;
  email: string;
  mobile: string;
  branch?: BranchInfo;
  pension_roles: string[];
  system_roles: string[];
  pension_enrollments: PensionEnrollment[];
  sponsored_members_count: number;
  is_eligible: boolean;
}
```

---

## Troubleshooting

### Hook not fetching data
- Check if `enabled` parameter is set correctly
- Verify that required parameters (userId or memberId) are provided
- Check React Query DevTools for query status

### Stale data showing
- Adjust `staleTime` in hook configuration
- Use `refetch()` to manually refresh data
- Check cache invalidation logic

### Multiple requests firing
- Ensure `enabled` parameter prevents unnecessary calls
- Use debouncing for search inputs
- Check for duplicate hook calls in component tree

---

## Related Files

- **Hooks**: `lib/hooks/public/useSponsor.ts`
- **API Functions**: `lib/api/functions/public/sponsorApi.ts`
- **Component**: `components/public/membership/SponsorInformation.tsx`
- **Types**: Exported from hook and API files
