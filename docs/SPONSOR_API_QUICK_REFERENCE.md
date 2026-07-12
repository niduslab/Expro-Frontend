# Sponsor API Quick Reference

## Base URL Configuration

The axios instance is configured with:
```typescript
baseURL: "http://127.0.0.1:8000/api/v1"
```

**Important:** API function paths should NOT include `/api/v1/` prefix since it's already in the base URL.

---

## ✅ Correct API Paths

### 1. Validate Sponsor
**Function Path:** `/sponsor/validate`  
**Full URL:** `http://127.0.0.1:8000/api/v1/sponsor/validate`

```typescript
// ✅ Correct
await apiRequest.get("/sponsor/validate", { params: { member_id: "EXP001" } });

// ❌ Wrong (double /api/v1/)
await apiRequest.get("/api/v1/sponsor/validate", { params: { member_id: "EXP001" } });
```

**Query Parameters:**
- `user_id` (optional): User ID to validate
- `member_id` (optional): Member ID to validate

**Example Requests:**
```bash
# By Member ID
GET http://127.0.0.1:8000/api/v1/sponsor/validate?member_id=EXP001

# By User ID
GET http://127.0.0.1:8000/api/v1/sponsor/validate?user_id=123
```

---

### 2. Search Sponsors
**Function Path:** `/sponsors/search`  
**Full URL:** `http://127.0.0.1:8000/api/v1/sponsors/search`

```typescript
// ✅ Correct
await apiRequest.get("/sponsors/search", { 
  params: { 
    query: "john", 
    eligible_only: true, 
    limit: 10 
  } 
});

// ❌ Wrong (double /api/v1/)
await apiRequest.get("/api/v1/sponsors/search", { params: { query: "john" } });
```

**Query Parameters:**
- `query` (required): Search term
- `eligible_only` (optional): Filter to eligible sponsors only (boolean)
- `limit` (optional): Maximum number of results (default: 10)

**Example Request:**
```bash
GET http://127.0.0.1:8000/api/v1/sponsors/search?query=john&eligible_only=true&limit=10
```

---

### 3. Get Sponsor Details
**Function Path:** `/sponsor/{sponsorId}`  
**Full URL:** `http://127.0.0.1:8000/api/v1/sponsor/{sponsorId}`

```typescript
// ✅ Correct
await apiRequest.get(`/sponsor/${123}`);

// ❌ Wrong (double /api/v1/)
await apiRequest.get(`/api/v1/sponsor/${123}`);
```

**Path Parameters:**
- `sponsorId` (required): User ID of the sponsor

**Example Request:**
```bash
GET http://127.0.0.1:8000/api/v1/sponsor/123
```

---

## 🔍 How to Check Your API Paths

### Method 1: Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Trigger the API call
4. Check the Request URL

**Expected:** `http://127.0.0.1:8000/api/v1/sponsor/validate`  
**Wrong:** `http://127.0.0.1:8000/api/v1/api/v1/sponsor/validate`

### Method 2: Console Logging
Add logging to your API functions:
```typescript
export const validateSponsor = async (userId?, memberId?) => {
  const path = "/sponsor/validate";
  console.log("API Path:", path);
  console.log("Full URL:", `${baseURL}${path}`);
  
  const response = await apiRequest.get(path, { params });
  return response.data;
};
```

---

## 📝 Pattern Examples from Other APIs

Here are examples from existing API functions in the project:

### User APIs
```typescript
// ✅ Correct patterns
apiRequest.get("/mybranch")                    // Full: /api/v1/mybranch
apiRequest.get("/mywallet")                    // Full: /api/v1/mywallet
apiRequest.get("/mynominees")                  // Full: /api/v1/mynominees
apiRequest.get("/mypensionenrollments")        // Full: /api/v1/mypensionenrollments
```

### Public APIs
```typescript
// ✅ Correct patterns
apiRequest.get("/public/galleries")            // Full: /api/v1/public/galleries
apiRequest.get(`/public/galleries/${id}`)      // Full: /api/v1/public/galleries/{id}
publicApiRequest.get("/public/blogs")          // Full: /api/v1/public/blogs
```

### Admin APIs
```typescript
// ✅ Correct patterns
apiRequest.get("/pensionpackages")             // Full: /api/v1/pensionpackages
apiRequest.get(`/pensionpackage/${id}`)        // Full: /api/v1/pensionpackage/{id}
apiRequest.get("/galleries")                   // Full: /api/v1/galleries
```

### Pension Team APIs
```typescript
// ✅ Correct patterns
apiRequest.get("/pension/team/hierarchy-tree") // Full: /api/v1/pension/team/hierarchy-tree
apiRequest.get("/pension/team/members")        // Full: /api/v1/pension/team/members
apiRequest.get("/my-commissions")              // Full: /api/v1/my-commissions
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Including /api/v1/ in path
```typescript
// Wrong
apiRequest.get("/api/v1/sponsor/validate")
// Results in: http://127.0.0.1:8000/api/v1/api/v1/sponsor/validate
```

### ❌ Mistake 2: Missing leading slash
```typescript
// Wrong
apiRequest.get("sponsor/validate")
// Results in: http://127.0.0.1:8000/api/v1sponsor/validate
```

### ✅ Correct Pattern
```typescript
// Correct
apiRequest.get("/sponsor/validate")
// Results in: http://127.0.0.1:8000/api/v1/sponsor/validate
```

---

## 🔧 Backend API Routes

For backend developers, the Laravel routes should be defined as:

```php
// routes/api.php

// Base route group already has 'api/v1' prefix
Route::prefix('v1')->group(function () {
    
    // Sponsor routes
    Route::get('/sponsor/validate', [SponsorController::class, 'validate']);
    Route::get('/sponsor/{sponsorId}', [SponsorController::class, 'show']);
    Route::get('/sponsors/search', [SponsorController::class, 'search']);
    
});
```

**Full URLs:**
- `GET /api/v1/sponsor/validate`
- `GET /api/v1/sponsor/{sponsorId}`
- `GET /api/v1/sponsors/search`

---

## 📦 Complete Example

### Frontend API Function
```typescript
// lib/api/functions/public/sponsorApi.ts
export const validateSponsor = async (userId?, memberId?) => {
  const params: Record<string, string | number> = {};
  if (userId) params.user_id = userId;
  if (memberId) params.member_id = memberId;

  const response = await apiRequest.get<SponsorValidationResult>(
    "/sponsor/validate",  // ✅ No /api/v1/ prefix
    { params }
  );
  return response.data;
};
```

### Backend Route
```php
// routes/api.php
Route::get('/sponsor/validate', [SponsorController::class, 'validate']);
```

### Backend Controller
```php
// app/Http/Controllers/SponsorController.php
public function validate(Request $request)
{
    $userId = $request->query('user_id');
    $memberId = $request->query('member_id');
    
    // Validation logic...
    
    return response()->json([
        'success' => true,
        'data' => [
            'is_eligible' => true,
            'user_id' => 123,
            'member_id' => 'EXP001',
            // ... other fields
        ]
    ]);
}
```

### Frontend Usage
```typescript
// Component or Hook
const response = await validateSponsor(undefined, 'EXP001');
// Calls: http://127.0.0.1:8000/api/v1/sponsor/validate?member_id=EXP001
```

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] API paths don't include `/api/v1/` prefix
- [ ] All paths start with `/`
- [ ] Backend routes match frontend paths
- [ ] Network tab shows correct URLs (no double `/api/v1/`)
- [ ] API responses match TypeScript types
- [ ] Error handling works correctly
- [ ] Query parameters are properly encoded

---

## 🔗 Related Files

- **Axios Config:** `lib/api/axios.ts`
- **Sponsor API:** `lib/api/functions/public/sponsorApi.ts`
- **Sponsor Hooks:** `lib/hooks/public/useSponsor.ts`
- **Component:** `components/public/membership/SponsorInformation.tsx`
