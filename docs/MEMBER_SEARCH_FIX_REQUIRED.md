# Member Search Fix Required (Backend)

## Issue
The member search functionality in `/admin/members` page is not working properly. Users expect to search by:
- Member Name (English)
- Member ID
- Email
- Phone Number

## Current Status
✅ **Frontend**: Correctly sending `search` parameter to API
❌ **Backend**: Not searching across all required fields

## Frontend Implementation (Already Working)
```typescript
// File: app/(auth)/admin/members/page.tsx
const { data: response, isLoading } = useMembers({
  page,
  per_page: perPage,
  search: search || undefined,  // ✅ Correctly passed
  status: statusFilter || undefined,
  pension_role: enrollmentRoleFilter || undefined,
});
```

## Backend Fix Required

### Endpoint
`GET /api/v1/admin/members?search={query}`

### Required Changes
The backend controller needs to search across multiple fields when the `search` parameter is provided.

### Laravel Implementation Example

```php
// In your MemberController or similar

public function index(Request $request)
{
    $query = User::with(['member', 'wallet', 'pension_enrollments']);
    
    // Search functionality
    if ($request->has('search') && !empty($request->search)) {
        $searchTerm = $request->search;
        
        $query->where(function($q) use ($searchTerm) {
            // Search by email
            $q->orWhere('email', 'LIKE', "%{$searchTerm}%")
              
              // Search by member profile fields
              ->orWhereHas('member', function($memberQuery) use ($searchTerm) {
                  $memberQuery->where('name_english', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('name_bangla', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('member_id', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('mobile', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('alternate_mobile', 'LIKE', "%{$searchTerm}%");
              });
        });
    }
    
    // Status filter
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }
    
    // Pension role filter
    if ($request->has('pension_role')) {
        $query->whereHas('pension_enrollments.package_roles', function($q) use ($request) {
            $q->where('role', $request->pension_role)
              ->where('is_active', true);
        });
    }
    
    // Pagination
    $perPage = $request->get('per_page', 50);
    $members = $query->paginate($perPage);
    
    return response()->json([
        'success' => true,
        'data' => $members
    ]);
}
```

## Search Fields Required

| Field | Table | Column | Description |
|-------|-------|--------|-------------|
| Email | `users` | `email` | User's email address |
| Name (English) | `member_profiles` | `name_english` | Member's English name |
| Name (Bangla) | `member_profiles` | `name_bangla` | Member's Bangla name |
| Member ID | `member_profiles` | `member_id` | Unique member identifier |
| Phone | `member_profiles` | `mobile` | Primary phone number |
| Alt Phone | `member_profiles` | `alternate_mobile` | Alternate phone number |

## Testing

After implementing the fix, test with these search queries:

1. **Search by name**: "John" or "জন"
2. **Search by email**: "john@example.com"
3. **Search by member ID**: "MEM-00123"
4. **Search by phone**: "01712345678"
5. **Partial search**: "john" should match "John Doe"

## Expected Behavior

- Search should be **case-insensitive**
- Search should support **partial matches** (LIKE query)
- Search should work across **all specified fields** (OR condition)
- Empty search should return all members (no filter applied)

## Priority
🔴 **HIGH** - This is a core functionality for admin member management

## Related Files
- Frontend: `app/(auth)/admin/members/page.tsx`
- Hook: `lib/hooks/admin/useMembers.ts`
- Backend: `app/Http/Controllers/Admin/MemberController.php` (or similar)
