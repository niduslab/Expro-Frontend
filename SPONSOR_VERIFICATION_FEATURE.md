# Sponsor Verification Feature

## Overview
The sponsor verification feature allows new members to search for and verify their sponsor during the membership registration process. This ensures that only eligible members can act as sponsors and provides a seamless user experience.

## Features Implemented

### 1. Sponsor Search
- **Search by multiple criteria**: Name, Member ID, Email, or Phone Number
- **Real-time search**: Instant results as users type
- **Eligible sponsors only**: Filter to show only members who can be sponsors
- **Visual feedback**: Loading states and empty states
- **Quick selection**: Click to auto-fill sponsor information

### 2. Sponsor Verification
- **Manual verification**: Enter Member ID and click "Verify" button
- **Automatic validation**: Checks sponsor eligibility based on roles
- **Visual confirmation**: Green success card with sponsor details
- **Error handling**: Clear error messages for invalid or ineligible sponsors

### 3. Eligibility Criteria
Sponsors must have one of the following roles:

**Pension Roles:**
- `executive_member`
- `project_presenter`
- `assistant_pp`

**System Roles:**
- `chairman`
- `super-admin`
- `admin`
- `manager`

**Not Eligible:**
- Users who are only `general_member`
- Users with no active roles

### 4. User Experience Enhancements
- **Auto-fill**: Sponsor name auto-fills after successful verification
- **Read-only fields**: Verified sponsor name cannot be manually edited
- **Reset on change**: Verification resets if user modifies Member ID
- **Validation**: Cannot proceed to next step without verification
- **Responsive design**: Works seamlessly on mobile and desktop

## API Endpoints Used

### 1. Validate Sponsor Eligibility
```typescript
GET /sponsor/validate?member_id={memberId}
GET /sponsor/validate?user_id={userId}
```

**Full URL:** `http://127.0.0.1:8000/api/v1/sponsor/validate`

**Response:**
```json
{
  "is_eligible": true,
  "reason": "User has eligible pension role: executive_member",
  "user_id": 123,
  "member_id": "EXP001",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+8801712345678",
  "pension_roles": ["executive_member"],
  "system_roles": ["member"],
  "pension_enrollments": [
    {
      "id": 1,
      "enrollment_number": "ENR001",
      "package_name": "Premium Package",
      "role": "executive_member",
      "status": "active"
    }
  ]
}
```

### 2. Search Sponsors
```typescript
GET /sponsors/search?query={searchTerm}&eligible_only=true&limit=10
```

**Full URL:** `http://127.0.0.1:8000/api/v1/sponsors/search`

**Response:**
```json
[
  {
    "user_id": 123,
    "member_id": "EXP001",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+8801712345678",
    "is_eligible": true,
    "eligibility_reason": "Has eligible pension role"
  }
]
```

### 3. Get Sponsor Details
```typescript
GET /sponsor/{sponsorId}
```

**Full URL:** `http://127.0.0.1:8000/api/v1/sponsor/{sponsorId}`

**Response:**
```json
{
  "user_id": 123,
  "member_id": "EXP001",
  "name_english": "John Doe",
  "name_bangla": "জন ডো",
  "email": "john@example.com",
  "mobile": "+8801712345678",
  "branch": {
    "id": 1,
    "name": "Dhaka Branch",
    "code": "DHK"
  },
  "pension_roles": ["executive_member"],
  "system_roles": ["member"],
  "pension_enrollments": [...],
  "sponsored_members_count": 5,
  "is_eligible": true
}
```

## Component Structure

### SponsorInformation Component
**Location:** `components/public/membership/SponsorInformation.tsx`

**State Management:**
```typescript
export type SponsorInfoState = {
  sponsorName: string;
  sponsorMemberId: string;
  sponsorUserId?: number;
  isVerified?: boolean;
};
```

**React Query Hooks Used:**
- `useValidateSponsor()`: Validates sponsor by Member ID
- `useSearchSponsors()`: Searches for sponsors by query

**Key Functions:**
- `handleVerifySponsor()`: Triggers sponsor validation
- `handleSearchSponsors()`: Triggers sponsor search
- `handleSelectSponsor()`: Auto-fills form with selected sponsor
- `validate()`: Ensures sponsor is verified before proceeding

### Custom Hooks
**Location:** `lib/hooks/public/useSponsor.ts`

**Exported Hooks:**
- `useValidateSponsor(userId?, memberId?, enabled)`: Validate sponsor eligibility
- `useSponsorDetails(sponsorId, enabled)`: Get complete sponsor information
- `useSearchSponsors(params, enabled)`: Search for eligible sponsors

**Hook Pattern:**
All hooks use React Query for:
- Automatic caching
- Background refetching
- Loading and error states
- Request deduplication

### API Functions
**Location:** `lib/api/functions/public/sponsorApi.ts`

**Exported Functions:**
- `validateSponsor(userId?, memberId?)`: Validate sponsor eligibility
- `getSponsorDetails(sponsorId)`: Get complete sponsor information
- `searchSponsors(params)`: Search for eligible sponsors

## UI Components

### Search Section
- Search input with icon
- Search button with loading state
- Dropdown results list
- Empty state message

### Verification Section
- Member ID input field
- Verify button with loading state
- Error messages with icons
- Success card with sponsor details

### Sponsor Information Card
Displays after successful verification:
- Avatar with initial
- Full name with verification badge
- Member ID, Email, Mobile
- Pension roles
- Pension enrollments (badges)
- Verification status

## Validation Rules

1. **Sponsor Member ID**: Required and must be verified
2. **Sponsor Name**: Required (auto-filled after verification)
3. **Verification Status**: Must be `true` to proceed to next step
4. **Re-verification**: Required if Member ID is changed after verification

## Error Handling

### Common Error Scenarios:
1. **Sponsor not found**: "Sponsor not found. Please check the Member ID."
2. **Not eligible**: "This member is not eligible to be a sponsor"
3. **Network error**: "Failed to verify sponsor. Please try again."
4. **Empty search**: No results message with helpful text
5. **Validation error**: "Please verify the sponsor before proceeding"

## Testing Checklist

- [ ] Search sponsors by name
- [ ] Search sponsors by Member ID
- [ ] Search sponsors by email
- [ ] Search sponsors by phone
- [ ] Verify sponsor with valid Member ID
- [ ] Verify sponsor with invalid Member ID
- [ ] Try to proceed without verification
- [ ] Change Member ID after verification
- [ ] Select sponsor from search results
- [ ] View sponsor details after verification
- [ ] Test on mobile devices
- [ ] Test with slow network
- [ ] Test error states

## Future Enhancements

1. **QR Code Scanning**: Scan sponsor's QR code for instant verification
2. **Recent Sponsors**: Show recently verified sponsors
3. **Sponsor Recommendations**: Suggest sponsors based on location/branch
4. **Sponsor Profile Preview**: Show full profile before selection
5. **Multiple Sponsor Support**: Allow multiple sponsors if needed
6. **Sponsor Invitation**: Send invitation to potential sponsors

## Integration Notes

### Form Data Storage
The sponsor information is stored in the parent `MembershipForm` component and persisted to localStorage:

```typescript
sponsorInfo: {
  sponsorName: string;
  sponsorMemberId: string;
  sponsorUserId?: number;
  isVerified?: boolean;
}
```

### Submission Payload
When the form is submitted, the sponsor information is included in the complete membership payload:

```typescript
{
  personalInfo: {...},
  addressInfo: {...},
  nomineeInfo: {...},
  sponsorInfo: {
    sponsorName: "John Doe",
    sponsorMemberId: "EXP001",
    sponsorUserId: 123,
    isVerified: true
  },
  pensionInfo: {...}
}
```

## Dependencies

- **@tanstack/react-query**: Data fetching and caching
- **lucide-react**: Icons (Search, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight)
- **axios**: HTTP requests (via custom apiRequest wrapper)
- **React**: State management and component lifecycle

## Architecture

### Data Flow
1. **User Action** → Component handler function
2. **Handler** → Sets React Query hook parameters
3. **Hook** → Calls API function
4. **API Function** → Makes HTTP request via axios
5. **Response** → Cached by React Query
6. **Component** → Receives data via hook
7. **UI Update** → Renders new state

### Benefits of Hook-Based Approach
- **Automatic Caching**: Reduces unnecessary API calls
- **Background Refetching**: Keeps data fresh
- **Loading States**: Built-in loading indicators
- **Error Handling**: Centralized error management
- **Request Deduplication**: Prevents duplicate requests
- **Optimistic Updates**: Better UX with instant feedback

## Styling

- **Primary Color**: `#008543` (Green)
- **Hover Color**: `#006C36` (Dark Green)
- **Success Color**: Green-50/600 shades
- **Error Color**: Red-500
- **Border Radius**: `rounded-md` (0.375rem)
- **Shadows**: `shadow-sm`

## Accessibility

- ARIA labels for form inputs
- `aria-invalid` for error states
- Keyboard navigation support (Enter key for search)
- Focus states for all interactive elements
- Screen reader friendly error messages
- Disabled state indicators

## Performance Considerations

- Debounced search (can be added)
- Lazy loading of search results
- Optimistic UI updates
- Error boundary for API failures
- Loading states for better UX

## Security Considerations

- Input sanitization on backend
- Rate limiting for search API
- Authentication required for API calls
- HTTPS for all API requests
- No sensitive data in localStorage (only IDs and names)
