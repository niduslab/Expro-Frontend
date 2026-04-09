# Frontend API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000/api/v1`  
**Production URL:** `https://api.expro.com/api/v1`

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Public Endpoints](#public-endpoints)
4. [User & Profile](#user--profile)
5. [Wallet & Transactions](#wallet--transactions)
6. [Branches](#branches)
7. [Nominees](#nominees)
8. [Pension System](#pension-system)
9. [Membership](#membership)
10. [Commissions](#commissions)
11. [Team Collections](#team-collections)
12. [Projects](#projects)
13. [Blog System](#blog-system)
14. [Digital ID Cards](#digital-id-cards)
15. [Modification Requests](#modification-requests)
16. [Events](#events)
17. [Donations](#donations)
18. [Contact Messages](#contact-messages)
19. [Expro Team Members](#expro-team-members)
20. [Payments](#payments)
21. [Documents](#documents)
22. [Notices](#notices)
23. [Careers](#careers)
24. [Galleries](#galleries)
25. [YouTube Videos](#youtube-videos)
26. [Notifications](#notifications)
27. [Admin Endpoints](#admin-endpoints)
28. [Chairman Endpoints](#chairman-endpoints)
29. [Response Formats](#response-formats)
30. [Error Handling](#error-handling)

---

## Getting Started

### Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Axios configuration example
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Rate Limiting

All endpoints are rate-limited to **10 requests per minute** per IP address.

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /public/register`  
**Auth Required:** No

```javascript
// Request
const response = await api.post('/public/register', {
  email: 'user@example.com',
  password: 'SecurePass123!',
  password_confirmation: 'SecurePass123!',
  branch_id: 1,
  sponsor_id: 5
});

// Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "branch_id": 1,
      "sponsor_id": 5,
      "status": "pending"
    },
    "token": "1|abc123xyz..."
  }
}
```

### Login

Authenticate and receive access token.

**Endpoint:** `POST /public/login`  
**Auth Required:** No

```javascript
// Request
const response = await api.post('/public/login', {
  email: 'user@example.com',
  password: 'SecurePass123!'
});

// Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "email": "user@example.com" },
    "token": "1|abc123xyz...",
    "token_type": "Bearer"
  }
}
```

### Logout

Revoke current access token.

**Endpoint:** `POST /logout`  
**Auth Required:** Yes

```javascript
await api.post('/logout');
// Response: { "success": true, "message": "Logged out successfully" }
```

### Logout All Devices

Revoke all access tokens.

**Endpoint:** `POST /logout-all`  
**Auth Required:** Yes

```javascript
await api.post('/logout-all');
// Response: { "success": true, "message": "Logged out from all devices" }
```

---

## Public Endpoints

### Get Membership Applications

**Endpoint:** `GET /public/membership-applications`  
**Auth Required:** No

```javascript
const response = await api.get('/public/membership-applications', {
  params: { page: 1, per_page: 15 }
});
```

### Get Single Membership Application

**Endpoint:** `GET /public/membership-applications/{id}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/membership-applications/1');
```

### Submit Membership Application

**Endpoint:** `POST /public/membership-application`  
**Auth Required:** No

```javascript
const response = await api.post('/public/membership-application', {
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '8801712345678',
  branch_id: 1,
  membership_type: 'general',
  nid_number: '1234567890'
});
```

---

## User & Profile

### Get My Profile

**Endpoint:** `GET /myprofile`  
**Auth Required:** Yes

```javascript
const response = await api.get('/myprofile');

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "full_name": "John Doe",
    "phone": "8801712345678",
    "date_of_birth": "1990-01-15",
    "gender": "male",
    "address": "Dhaka, Bangladesh",
    "profile_photo": "https://..."
  }
}
```

### Create Member Profile

**Endpoint:** `POST /memberprofile`  
**Auth Required:** Yes

```javascript
const response = await api.post('/memberprofile', {
  full_name: 'John Doe',
  phone: '8801712345678',
  date_of_birth: '1990-01-15',
  gender: 'male',
  address: 'Dhaka, Bangladesh',
  nid_number: '1234567890',
  profile_photo: 'base64_encoded_image'
});
```

### Update Member Profile

**Endpoint:** `PUT /memberprofile/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/memberprofile/1', {
  full_name: 'John Doe Updated',
  phone: '8801712345679'
});
```

### Delete Member Profile

**Endpoint:** `DELETE /memberprofile/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/memberprofile/1');
```

---

## Wallet & Transactions

### Get My Wallet

**Endpoint:** `GET /mywallet`  
**Auth Required:** Yes

```javascript
const response = await api.get('/mywallet');

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "balance": 5000.00,
    "currency": "BDT",
    "status": "active"
  }
}
```

### Get My Wallet Transactions

**Endpoint:** `GET /mywallettransactions`  
**Auth Required:** Yes

```javascript
const response = await api.get('/mywallettransactions', {
  params: {
    page: 1,
    per_page: 15,
    type: 'credit', // or 'debit'
    category: 'commission',
    from_date: '2024-01-01',
    to_date: '2024-12-31'
  }
});

// Response
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "type": "credit",
        "category": "commission",
        "amount": 500.00,
        "balance_after": 5500.00,
        "description": "Commission payment",
        "created_at": "2024-02-23T10:00:00.000000Z"
      }
    ],
    "total": 50,
    "per_page": 15
  }
}
```

### Get Company Wallet (Admin)

**Endpoint:** `GET /admin/wallets/company`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.get('/admin/wallets/company');

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "balance": 250000.00,
    "currency": "BDT",
    "status": "active",
    "total_deposits": 500000.00,
    "total_withdrawals": 250000.00,
    "last_transaction_date": "2024-03-15T10:00:00.000000Z"
  }
}
```

### Get Company Wallet Dashboard (Admin)

**Endpoint:** `GET /admin/wallets/company/dashboard`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.get('/admin/wallets/company/dashboard');

// Response
{
  "success": true,
  "data": {
    "total_balance": 250000.00,
    "commission_pool": 18500.00,
    "total_deposited": 500000.00,
    "total_withdrawn": 250000.00,
    "pending_commissions": 5000.00,
    "monthly_stats": {
      "deposits": 50000.00,
      "withdrawals": 30000.00,
      "net_change": 20000.00
    },
    "recent_activity": [
      {
        "type": "credit",
        "amount": 5000.00,
        "description": "Membership fee payment",
        "date": "2024-03-15T10:00:00.000000Z"
      }
    ]
  }
}
```

### Get Company Wallet Transactions (Admin)

**Endpoint:** `GET /admin/wallets/company/transactions`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.get('/admin/wallets/company/transactions', {
  params: {
    page: 1,
    per_page: 15,
    type: 'credit', // or 'debit'
    category: 'membership_fee',.ll
    from_date: '2024-01-01',
    to_date: '2024-12-31'
  }
});

// Response
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "type": "credit",
        "category": "membership_fee",
        "amount": 1000.00,
        "balance_after": 251000.00,
        "description": "Monthly membership fee",
        "user_id": 5,
        "user_name": "John Doe",
        "created_at": "2024-03-15T10:00:00.000000Z"
      }
    ],
    "total": 150,
    "per_page": 15
  }
}
```

---

## Branches

### List All Branches

**Endpoint:** `GET /branches`  
**Auth Required:** Yes

```javascript
const response = await api.get('/branches', {
  params: { page: 1, per_page: 15, search: 'Dhaka' }
});
```

### Get Branch Details

**Endpoint:** `GET /branch/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/branch/1');
```

### Create Branch

**Endpoint:** `POST /branch`  
**Auth Required:** Yes

```javascript
const response = await api.post('/branch', {
  name: 'Chittagong Branch',
  code: 'CTG-001',
  address: 'Agrabad, Chittagong',
  phone: '031-123456789',
  email: 'chittagong@expro.com',
  status: 'active'
});
```

### Update Branch

**Endpoint:** `PUT /branch/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/branch/1', {
  name: 'Chittagong Central',
  phone: '031-987654321'
});
```

### Delete Branch

**Endpoint:** `DELETE /branch/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/branch/1');
```

---

## Nominees

### List All Nominees

**Endpoint:** `GET /nominees`  
**Auth Required:** Yes

```javascript
const response = await api.get('/nominees');
```

### Get Nominee Details

**Endpoint:** `GET /nominee/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/nominee/1');
```

### Create Nominee

**Endpoint:** `POST /nominee`  
**Auth Required:** Yes

```javascript
const response = await api.post('/nominee', {
  full_name: 'Jane Doe',
  relationship: 'spouse',
  phone: '8801712345678',
  nid_number: '9876543210',
  date_of_birth: '1992-05-20',
  address: 'Dhaka, Bangladesh',
  percentage: 100
});
```

### Update Nominee

**Endpoint:** `PUT /nominee/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/nominee/1', {
  phone: '8801712345679',
  percentage: 50
});
```

### Delete Nominee

**Endpoint:** `DELETE /nominee/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/nominee/1');
```

---

## Pension System

### Pension Packages

#### List All Pension Packages

**Endpoint:** `GET /pensionpackages`  
**Auth Required:** Yes

```javascript
const response = await api.get('/pensionpackages', {
  params: { page: 1, per_page: 15, status: 'active' }
});
```

#### Get Pension Package Details

**Endpoint:** `GET /pensionpackage/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/pensionpackage/1');
```

#### Create Pension Package

**Endpoint:** `POST /pensionpackages`  
**Auth Required:** Yes

```javascript
const response = await api.post('/pensionpackages', {
  name: 'Gold Package',
  description: 'Premium pension package',
  monthly_amount: 5000,
  duration_months: 120,
  total_amount: 600000,
  maturity_amount: 750000,
  status: 'active'
});
```

#### Update Pension Package

**Endpoint:** `PUT /pensionpackage/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/pensionpackage/1', {
  name: 'Gold Package Updated',
  monthly_amount: 5500
});
```

#### Delete Pension Package

**Endpoint:** `DELETE /pensionpackage/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/pensionpackage/1');
```

### Pension Enrollments

#### List All Pension Enrollments

**Endpoint:** `GET /pensionenrollments`  
**Auth Required:** Yes

```javascript
const response = await api.get('/pensionenrollments', {
  params: { page: 1, status: 'active' }
});
```

#### Get My Pension Enrollments

**Endpoint:** `GET /mypensionenrollments`  
**Auth Required:** Yes

```javascript
const response = await api.get('/mypensionenrollments');
```

#### Get Pension Enrollment Details

**Endpoint:** `GET /pensionenrollment/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/pensionenrollment/1');
```

#### Create Pension Enrollment

**Endpoint:** `POST /pensionenrollment`  
**Auth Required:** Yes

```javascript
const response = await api.post('/pensionenrollment', {
  pension_package_id: 1,
  start_date: '2024-03-01',
  nominee_id: 1
});
```

#### Update Pension Enrollment

**Endpoint:** `PUT /pensionenrollment/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/pensionenrollment/1', {
  status: 'active',
  nominee_id: 2
});
```

#### Delete Pension Enrollment

**Endpoint:** `DELETE /pensionenrollment/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/pensionenrollment/1');
```

### Pension Installments

#### List All Pension Installments

**Endpoint:** `GET /pensioninstallments`  
**Auth Required:** Yes

```javascript
const response = await api.get('/pensioninstallments', {
  params: { page: 1, status: 'pending' }
});
```

#### Get My Pension Installments

**Endpoint:** `GET /mypensioninstallments`  
**Auth Required:** Yes

```javascript
const response = await api.get('/mypensioninstallments');
```

#### Get Pension Installment Details

**Endpoint:** `GET /pensioninstallment/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/pensioninstallment/1');
```

#### Create Pension Installment

**Endpoint:** `POST /pensioninstallment`  
**Auth Required:** Yes

```javascript
const response = await api.post('/pensioninstallment', {
  pension_enrollment_id: 1,
  amount: 5000,
  due_date: '2024-04-01',
  status: 'pending'
});
```

#### Update Pension Installment

**Endpoint:** `PUT /pensioninstallment/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/pensioninstallment/1', {
  status: 'paid',
  paid_date: '2024-04-01'
});
```

#### Delete Pension Installment

**Endpoint:** `DELETE /pensioninstallment/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/pensioninstallment/1');
```

---

## Membership

### List Membership Fees

**Endpoint:** `GET /membershipfees`  
**Auth Required:** Yes

```javascript
const response = await api.get('/membershipfees', {
  params: { page: 1, status: 'pending' }
});
```

### Create Membership Fee

**Endpoint:** `POST /membershipfee`  
**Auth Required:** Yes

```javascript
const response = await api.post('/membershipfee', {
  user_id: 1,
  amount: 1000,
  fee_type: 'annual',
  due_date: '2024-12-31',
  status: 'pending'
});
```

### Update Membership Fee

**Endpoint:** `PUT /membershipfee/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/membershipfee/1', {
  status: 'paid',
  paid_date: '2024-03-15'
});
```

### Delete Membership Fee

**Endpoint:** `DELETE /membershipfee/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/membershipfee/1');
```

### Update Membership Application

**Endpoint:** `PUT /membership-application/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/membership-application/1', {
  status: 'approved',
  remarks: 'Application approved'
});
```

### Delete Membership Application

**Endpoint:** `DELETE /membership-application/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/membership-application/1');
```

---

## Commissions

### List All Commissions

**Endpoint:** `GET /commissions`  
**Auth Required:** Yes

```javascript
const response = await api.get('/commissions', {
  params: { 
    page: 1, 
    status: 'pending',
    type: 'referral'
  }
});
```

### Create Commission

**Endpoint:** `POST /commission`  
**Auth Required:** Yes

```javascript
const response = await api.post('/commission', {
  user_id: 1,
  amount: 500,
  commission_type: 'referral',
  reference_type: 'PensionEnrollment',
  reference_id: 10,
  status: 'pending'
});
```

### Update Commission

**Endpoint:** `PUT /commission/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/commission/1', {
  status: 'approved',
  approved_date: '2024-03-15'
});
```

### Delete Commission

**Endpoint:** `DELETE /commission/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/commission/1');
```

---

## Team Collections

### List All Team Collections

**Endpoint:** `GET /teamcollections`  
**Auth Required:** Yes

```javascript
const response = await api.get('/teamcollections', {
  params: { page: 1, per_page: 15 }
});
```

### Create Team Collection

**Endpoint:** `POST /teamcollection`  
**Auth Required:** Yes

```javascript
const response = await api.post('/teamcollection', {
  name: 'Monthly Collection March 2024',
  description: 'Team collection for March',
  target_amount: 50000,
  start_date: '2024-03-01',
  end_date: '2024-03-31',
  status: 'active'
});
```

### Update Team Collection

**Endpoint:** `PUT /teamcollection/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/teamcollection/1', {
  status: 'completed',
  collected_amount: 52000
});
```

### Delete Team Collection

**Endpoint:** `DELETE /teamcollection/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/teamcollection/1');
```

### Team Member Contributions

#### List All Contributions

**Endpoint:** `GET /teammembercontributions`  
**Auth Required:** Yes

```javascript
const response = await api.get('/teammembercontributions', {
  params: { team_collection_id: 1 }
});
```

#### Create Contribution

**Endpoint:** `POST /teammembercontribution`  
**Auth Required:** Yes

```javascript
const response = await api.post('/teammembercontribution', {
  team_collection_id: 1,
  user_id: 1,
  amount: 1000,
  contribution_date: '2024-03-15'
});
```

#### Update Contribution

**Endpoint:** `PUT /teammembercontribution/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/teammembercontribution/1', {
  amount: 1500
});
```

#### Delete Contribution

**Endpoint:** `DELETE /teammembercontribution/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/teammembercontribution/1');
```

---

## Projects

### List All Projects

**Endpoint:** `GET /projects`  
**Auth Required:** Yes

```javascript
const response = await api.get('/projects', {
  params: { 
    page: 1, 
    status: 'active',
    category: 'infrastructure'
  }
});
```

### Get Project Details

**Endpoint:** `GET /project/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/project/1');
```

### Create Project

**Endpoint:** `POST /project`  
**Auth Required:** Yes

```javascript
const response = await api.post('/project', {
  name: 'Community Center',
  description: 'Building a community center',
  category: 'infrastructure',
  target_amount: 5000000,
  start_date: '2024-04-01',
  end_date: '2024-12-31',
  status: 'active',
  location: 'Dhaka'
});
```

### Update Project

**Endpoint:** `PUT /project/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/project/1', {
  status: 'in_progress',
  collected_amount: 1000000
});
```

### Delete Project

**Endpoint:** `DELETE /project/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/project/1');
```

### Project Members

#### List Project Members

**Endpoint:** `GET /projectmembers`  
**Auth Required:** Yes

```javascript
const response = await api.get('/projectmembers', {
  params: { project_id: 1 }
});
```

#### Get Project Member Details

**Endpoint:** `GET /projectmember/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/projectmember/1');
```

#### Add Project Member

**Endpoint:** `POST /projectmember`  
**Auth Required:** Yes

```javascript
const response = await api.post('/projectmember', {
  project_id: 1,
  user_id: 5,
  role: 'coordinator',
  status: 'active'
});
```

#### Update Project Member

**Endpoint:** `PUT /projectmember/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/projectmember/1', {
  role: 'manager',
  status: 'active'
});
```

#### Delete Project Member

**Endpoint:** `DELETE /projectmember/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/projectmember/1');
```

### Project Packages

#### List Project Packages

**Endpoint:** `GET /projectpackages`  
**Auth Required:** Yes

```javascript
const response = await api.get('/projectpackages', {
  params: { project_id: 1 }
});
```

#### Get Project Package Details

**Endpoint:** `GET /projectpackage/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/projectpackage/1');
```

#### Create Project Package

**Endpoint:** `POST /projectpackage`  
**Auth Required:** Yes

```javascript
const response = await api.post('/projectpackage', {
  project_id: 1,
  name: 'Bronze Package',
  description: 'Basic contribution package',
  amount: 10000,
  benefits: 'Certificate of appreciation',
  status: 'active'
});
```

#### Update Project Package

**Endpoint:** `PUT /projectpackage/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/projectpackage/1', {
  amount: 12000,
  status: 'active'
});
```

#### Delete Project Package

**Endpoint:** `DELETE /projectpackage/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/projectpackage/1');
```

---

## Blog System

### Blog Posts

#### List All Blog Posts

**Endpoint:** `GET /blogposts`  
**Auth Required:** Yes

```javascript
const response = await api.get('/blogposts', {
  params: { 
    page: 1, 
    status: 'published',
    category_id: 1
  }
});
```

#### Get Blog Post Details

**Endpoint:** `GET /blogpost/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/blogpost/1');
```

#### Create Blog Post

**Endpoint:** `POST /blogpost`  
**Auth Required:** Yes

```javascript
const response = await api.post('/blogpost', {
  title: 'Welcome to Expro',
  slug: 'welcome-to-expro',
  content: 'Full blog post content...',
  excerpt: 'Short description',
  category_id: 1,
  featured_image: 'https://...',
  status: 'published',
  published_at: '2024-03-15T10:00:00Z'
});
```

#### Update Blog Post

**Endpoint:** `PUT /blogpost/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/blogpost/1', {
  title: 'Updated Title',
  status: 'published'
});
```

#### Delete Blog Post

**Endpoint:** `DELETE /blogpost/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/blogpost/1');
```

### Blog Categories

#### List All Blog Categories

**Endpoint:** `GET /blogcategories`  
**Auth Required:** Yes

```javascript
const response = await api.get('/blogcategories');
```

#### Get Blog Category Details

**Endpoint:** `GET /blogcategory/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/blogcategory/1');
```

#### Create Blog Category

**Endpoint:** `POST /blogcategory`  
**Auth Required:** Yes

```javascript
const response = await api.post('/blogcategory', {
  name: 'News',
  slug: 'news',
  description: 'Latest news and updates',
  status: 'active'
});
```

#### Update Blog Category

**Endpoint:** `PUT /blogcategory/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/blogcategory/1', {
  name: 'Latest News',
  status: 'active'
});
```

#### Delete Blog Category

**Endpoint:** `DELETE /blogcategory/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/blogcategory/1');
```

---

## Digital ID Cards

### List All Digital ID Cards

**Endpoint:** `GET /digitalidcards`  
**Auth Required:** Yes

```javascript
const response = await api.get('/digitalidcards', {
  params: { page: 1, status: 'active' }
});
```

### Get Digital ID Card Details

**Endpoint:** `GET /digitalidcard/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/digitalidcard/1');
```

### Create Digital ID Card

**Endpoint:** `POST /digitalidcard`  
**Auth Required:** Yes

```javascript
const response = await api.post('/digitalidcard', {
  user_id: 1,
  card_number: 'EXP-2024-001',
  issue_date: '2024-03-01',
  expiry_date: '2025-03-01',
  status: 'active',
  qr_code: 'base64_encoded_qr'
});
```

### Update Digital ID Card

**Endpoint:** `PUT /digitalidcard/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/digitalidcard/1', {
  status: 'active',
  expiry_date: '2026-03-01'
});
```

### Delete Digital ID Card

**Endpoint:** `DELETE /digitalidcard/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/digitalidcard/1');
```

---

## Modification Requests

### List All Modification Requests

**Endpoint:** `GET /modificationrequests`  
**Auth Required:** Yes

```javascript
const response = await api.get('/modificationrequests', {
  params: { page: 1, status: 'pending' }
});
```

### Get Modification Request Details

**Endpoint:** `GET /modificationrequest/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/modificationrequest/1');
```

### Create Modification Request

**Endpoint:** `POST /modificationrequest`  
**Auth Required:** Yes

```javascript
const response = await api.post('/modificationrequest', {
  request_type: 'profile_update',
  current_data: { phone: '8801712345678' },
  requested_data: { phone: '8801812345678' },
  reason: 'Changed phone number',
  status: 'pending'
});
```

### Update Modification Request

**Endpoint:** `PUT /modificationrequest/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/modificationrequest/1', {
  status: 'approved',
  admin_remarks: 'Request approved'
});
```

### Delete Modification Request

**Endpoint:** `DELETE /modificationrequest/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/modificationrequest/1');
```

---

## Events

### List All Events

**Endpoint:** `GET /events`  
**Auth Required:** Yes

```javascript
const response = await api.get('/events', {
  params: { 
    page: 1, 
    status: 'upcoming',
    from_date: '2024-03-01'
  }
});
```

### Get Event Details

**Endpoint:** `GET /event/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/event/1');
```

### Create Event

**Endpoint:** `POST /event`  
**Auth Required:** Yes

```javascript
const response = await api.post('/event', {
  title: 'Annual General Meeting',
  description: 'AGM for all members',
  event_date: '2024-06-15',
  event_time: '10:00:00',
  location: 'Dhaka Convention Center',
  capacity: 500,
  registration_deadline: '2024-06-10',
  status: 'upcoming'
});
```

### Update Event

**Endpoint:** `PUT /event/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/event/1', {
  capacity: 600,
  status: 'ongoing'
});
```

### Delete Event

**Endpoint:** `DELETE /event/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/event/1');
```

### Event Registrations

#### List All Event Registrations

**Endpoint:** `GET /eventregistrations`  
**Auth Required:** Yes

```javascript
const response = await api.get('/eventregistrations', {
  params: { event_id: 1, status: 'confirmed' }
});
```

#### Get Event Registration Details

**Endpoint:** `GET /eventregistration/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/eventregistration/1');
```

#### Create Event Registration

**Endpoint:** `POST /eventregistration`  
**Auth Required:** Yes

```javascript
const response = await api.post('/eventregistration', {
  event_id: 1,
  user_id: 1,
  number_of_guests: 2,
  special_requirements: 'Wheelchair access',
  status: 'pending'
});
```

#### Update Event Registration

**Endpoint:** `PUT /eventregistration/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/eventregistration/1', {
  status: 'confirmed',
  number_of_guests: 3
});
```

#### Delete Event Registration

**Endpoint:** `DELETE /eventregistration/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/eventregistration/1');
```

---

## Donations

### List All Donations

**Endpoint:** `GET /donations`  
**Auth Required:** Yes

```javascript
const response = await api.get('/donations', {
  params: { 
    page: 1, 
    type: 'general',
    status: 'completed'
  }
});
```

### Get Donation Details

**Endpoint:** `GET /donation/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/donation/1');
```

### Create Donation

**Endpoint:** `POST /donation`  
**Auth Required:** Yes

```javascript
const response = await api.post('/donation', {
  donor_name: 'John Doe',
  donor_email: 'john@example.com',
  donor_phone: '8801712345678',
  amount: 5000,
  donation_type: 'general',
  purpose: 'Community development',
  is_anonymous: false,
  status: 'pending'
});
```

### Update Donation

**Endpoint:** `PUT /donation/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/donation/1', {
  status: 'completed',
  payment_method: 'bkash'
});
```

### Delete Donation

**Endpoint:** `DELETE /donation/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/donation/1');
```

---

## Contact Messages

### List All Contact Messages

**Endpoint:** `GET /contactmessages`  
**Auth Required:** Yes

```javascript
const response = await api.get('/contactmessages', {
  params: { 
    page: 1, 
    status: 'unread',
    priority: 'high'
  }
});
```

### Get Contact Message Details

**Endpoint:** `GET /contactmessage/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/contactmessage/1');
```

### Create Contact Message

**Endpoint:** `POST /contactmessage`  
**Auth Required:** Yes

```javascript
const response = await api.post('/contactmessage', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '8801812345678',
  subject: 'Inquiry about membership',
  message: 'I would like to know more about...',
  priority: 'normal',
  status: 'unread'
});
```

### Update Contact Message

**Endpoint:** `PUT /contactmessage/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/contactmessage/1', {
  status: 'read',
  admin_reply: 'Thank you for your inquiry...'
});
```

### Delete Contact Message

**Endpoint:** `DELETE /contactmessage/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/contactmessage/1');
```

---

## Expro Team Members

### List All Expro Team Members

**Endpoint:** `GET /exproteammembers`  
**Auth Required:** Yes

```javascript
const response = await api.get('/exproteammembers', {
  params: { page: 1, status: 'active' }
});
```

### Get Expro Team Member Details

**Endpoint:** `GET /exproteammember/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/exproteammember/1');
```

### Create Expro Team Member

**Endpoint:** `POST /exproteammember`  
**Auth Required:** Yes

```javascript
const response = await api.post('/exproteammember', {
  name: 'Ahmed Khan',
  designation: 'Project Manager',
  department: 'Operations',
  email: 'ahmed@expro.com',
  phone: '8801712345678',
  photo: 'https://...',
  bio: 'Experienced project manager...',
  display_order: 1,
  status: 'active'
});
```

### Update Expro Team Member

**Endpoint:** `PUT /exproteammember/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/exproteammember/1', {
  designation: 'Senior Project Manager',
  display_order: 2
});
```

### Delete Expro Team Member

**Endpoint:** `DELETE /exproteammember/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/exproteammember/1');
```

---

## Payments

### Pay Pension Installments

**Endpoint:** `POST /pension-enrollment/pay/{enrollment_id}`  
**Auth Required:** Yes

```javascript
const response = await api.post('/pension-enrollment/pay/1', {
  installment_ids: [1, 2, 3],
  payment_method: 'sslcommerz'
});

// Response
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "payment_url": "https://sandbox.sslcommerz.com/...",
    "transaction_id": "TXN123456"
  }
}
```

### Payment History

#### List All Payment History

**Endpoint:** `GET /paymenthistories`  
**Auth Required:** Yes

```javascript
const response = await api.get('/paymenthistories', {
  params: { 
    page: 1,
    status: 'completed',
    from_date: '2024-01-01',
    to_date: '2024-12-31'
  }
});
```

#### Get My Payment History

**Endpoint:** `GET /paymenthistory`  
**Auth Required:** Yes

```javascript
const response = await api.get('/paymenthistory');

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "transaction_id": "TXN123456",
      "amount": 5000,
      "payment_method": "sslcommerz",
      "payment_type": "pension_installment",
      "status": "completed",
      "paid_at": "2024-03-15T10:00:00.000000Z"
    }
  ]
}
```

### SSLCommerz Payment Gateway

#### Initiate Payment

**Endpoint:** `POST /sslcommerz/initiate`  
**Auth Required:** Yes

```javascript
const response = await api.post('/sslcommerz/initiate', {
  amount: 5000,
  payment_type: 'pension_installment',
  reference_id: 1,
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '8801712345678'
});

// Response
{
  "success": true,
  "data": {
    "gateway_url": "https://sandbox.sslcommerz.com/...",
    "transaction_id": "TXN123456"
  }
}
```

#### Pay Via AJAX

**Endpoint:** `POST /sslcommerz/pay-via-ajax`  
**Auth Required:** Yes

```javascript
const response = await api.post('/sslcommerz/pay-via-ajax', {
  amount: 5000,
  payment_type: 'membership_fee',
  reference_id: 1
});
```

#### Payment Callbacks (Webhook)

These endpoints are called by SSLCommerz and should not be called directly from frontend:

- `POST /sslcommerz/success` - Payment success callback
- `POST /sslcommerz/fail` - Payment failure callback
- `POST /sslcommerz/cancel` - Payment cancellation callback
- `POST /sslcommerz/ipn` - Instant Payment Notification

---

## Documents

Document management system for uploading and managing various types of PDFs including profiles, awards, annual reports, rules, organograms, magazines, calendars, and notices.

### List All Documents (Public)

**Endpoint:** `GET /public/documents`  
**Auth Required:** No

```javascript
const response = await api.get('/public/documents', {
  params: { 
    page: 1,
    per_page: 15,
    type: 'annual_reports', // profile, awards, annual_reports, rules, organogram, magazine, calendar, notice, other
    status: 'active',
    is_featured: true,
    search: 'annual'
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Annual Report 2024",
      "description": "Complete annual report for 2024",
      "type": "annual_reports",
      "type_label": "Annual Reports",
      "file_name": "annual_report_2024.pdf",
      "file_url": "/storage/documents/1234567890_annual-report-2024.pdf",
      "file_size": 2048576,
      "file_size_formatted": "1.95 MB",
      "mime_type": "application/pdf",
      "download_count": 150,
      "view_count": 500,
      "publish_date": "2024-01-15",
      "is_featured": true,
      "display_order": 1,
      "status": "active",
      "uploaded_by": {
        "id": 1,
        "email": "admin@expro.com",
        "name": "Admin User"
      },
      "created_at": "2024-01-15 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

### Get Documents by Type (Public)

**Endpoint:** `GET /public/documents/type/{type}`  
**Auth Required:** No

```javascript
// Get all annual reports
const response = await api.get('/public/documents/type/annual_reports', {
  params: { page: 1, per_page: 15 }
});

// Available types:
// - profile
// - awards
// - annual_reports
// - rules
// - organogram
// - magazine
// - calendar
// - notice
// - other
```

### Get Featured Documents (Public)

**Endpoint:** `GET /public/documents/featured`  
**Auth Required:** No

```javascript
const response = await api.get('/public/documents/featured');

// Returns up to 10 featured documents
```

### Get Document Details (Public)

**Endpoint:** `GET /public/documents/{id}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/documents/1');

// Automatically increments view count
```

### Download Document (Public)

**Endpoint:** `GET /public/documents/{id}/download`  
**Auth Required:** No

```javascript
// Direct download link
const downloadUrl = `${API_BASE_URL}/public/documents/1/download`;

// Or using fetch
const response = await fetch(`${API_BASE_URL}/public/documents/1/download`);
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'document.pdf';
a.click();

// Automatically increments download count
```

### Upload Document (Admin Only)

**Endpoint:** `POST /document`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('name', 'Annual Report 2024');
formData.append('description', 'Complete annual report for 2024');
formData.append('type', 'annual_reports');
formData.append('file', pdfFile); // File object from input
formData.append('publish_date', '2024-01-15');
formData.append('is_featured', true);
formData.append('display_order', 1);
formData.append('status', 'active');

const response = await api.post('/document', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Response
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": { ... }
}
```

### Update Document (Admin Only)

**Endpoint:** `PUT /document/{id}`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('name', 'Annual Report 2024 Updated');
formData.append('description', 'Updated description');
formData.append('type', 'annual_reports');
formData.append('file', newPdfFile); // Optional - only if replacing file
formData.append('is_featured', false);
formData.append('status', 'active');

const response = await api.post(`/document/1?_method=PUT`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Delete Document (Admin Only)

**Endpoint:** `DELETE /document/{id}`  
**Auth Required:** Yes (Admin)

```javascript
await api.delete('/document/1');

// Deletes both database record and file from storage
```

### Document Types Reference

| Type | Value | Description |
|------|-------|-------------|
| Profile | `profile` | Organization profile documents |
| Awards | `awards` | Awards and recognition certificates |
| Annual Reports | `annual_reports` | Yearly financial and activity reports |
| Rules | `rules` | Rules and regulations |
| Organogram | `organogram` | Organizational structure charts |
| Magazine | `magazine` | Newsletters and magazines |
| Calendar | `calendar` | Event calendars |
| Notice | `notice` | Official notices and announcements |
| Other | `other` | Miscellaneous documents |

### Document Status

- `active` - Document is visible and downloadable
- `inactive` - Document is hidden from public view
- `archived` - Document is archived but not deleted

---

## Notices

Notice management system for publishing important announcements, circulars, and official notices to members.

### List All Notices (Public)

**Endpoint:** `GET /public/notices`  
**Auth Required:** No

```javascript
const response = await api.get('/public/notices', {
  params: { 
    page: 1,
    per_page: 15,
    type: 'general', // general, urgent, circular, announcement
    priority: 'high', // low, normal, high, urgent
    status: 'published',
    search: 'meeting'
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Annual General Meeting 2024",
      "slug": "annual-general-meeting-2024",
      "content": "Full notice content...",
      "excerpt": "Short description of the notice",
      "type": "announcement",
      "type_label": "Announcement",
      "priority": "high",
      "priority_label": "High",
      "publish_date": "2024-03-01",
      "expiry_date": "2024-06-30",
      "is_pinned": true,
      "view_count": 500,
      "status": "published",
      "status_label": "Published",
      "attachments": [
        {
          "name": "agenda.pdf",
          "url": "/storage/notices/agenda.pdf",
          "size": 1024576
        }
      ],
      "published_by": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@expro.com"
      },
      "created_at": "2024-03-01 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 45
  }
}
```

### Get Pinned Notices (Public)

**Endpoint:** `GET /public/notices/pinned`  
**Auth Required:** No

```javascript
const response = await api.get('/public/notices/pinned');

// Returns up to 5 pinned notices
```

### Get Urgent Notices (Public)

**Endpoint:** `GET /public/notices/urgent`  
**Auth Required:** No

```javascript
const response = await api.get('/public/notices/urgent');

// Returns all urgent priority notices
```

### Get Notice Details (Public)

**Endpoint:** `GET /public/notices/{id}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/notices/1');

// Automatically increments view count
```

### Create Notice (Admin Only)

**Endpoint:** `POST /notice`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('title', 'Annual General Meeting 2024');
formData.append('slug', 'annual-general-meeting-2024');
formData.append('content', 'Full notice content...');
formData.append('excerpt', 'Short description');
formData.append('type', 'announcement');
formData.append('priority', 'high');
formData.append('publish_date', '2024-03-01');
formData.append('expiry_date', '2024-06-30');
formData.append('is_pinned', true);
formData.append('status', 'published');
formData.append('attachments[]', file1); // Optional files
formData.append('attachments[]', file2);

const response = await api.post('/notice', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Update Notice (Admin Only)

**Endpoint:** `PUT /notice/{id}`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('status', 'published');
formData.append('is_pinned', false);

const response = await api.post(`/notice/1?_method=PUT`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Delete Notice (Admin Only)

**Endpoint:** `DELETE /notice/{id}`  
**Auth Required:** Yes (Admin)

```javascript
await api.delete('/notice/1');
```

### Notice Types

- `general` - General notices
- `urgent` - Urgent notices
- `circular` - Circulars
- `announcement` - Announcements

### Notice Priority

- `low` - Low priority
- `normal` - Normal priority
- `high` - High priority
- `urgent` - Urgent priority

---

## Careers

Career management system for posting job openings and managing applications.

### List All Careers (Public)

**Endpoint:** `GET /public/careers`  
**Auth Required:** No

```javascript
const response = await api.get('/public/careers', {
  params: { 
    page: 1,
    per_page: 15,
    job_type: 'full_time', // full_time, part_time, contract, internship, remote
    experience_level: 'mid', // entry, mid, senior, executive
    location: 'Dhaka',
    department: 'IT',
    is_featured: true,
    search: 'developer'
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Senior Software Engineer",
      "slug": "senior-software-engineer",
      "description": "Full job description...",
      "responsibilities": "Key responsibilities...",
      "requirements": "Required qualifications...",
      "benefits": "Benefits and perks...",
      "department": "IT",
      "location": "Dhaka",
      "job_type": "full_time",
      "job_type_label": "Full Time",
      "experience_level": "senior",
      "experience_level_label": "Senior",
      "salary_min": 80000,
      "salary_max": 120000,
      "salary_currency": "BDT",
      "salary_negotiable": true,
      "salary_range": "80,000 - 120,000 BDT",
      "vacancies": 2,
      "application_deadline": "2024-04-30",
      "contact_email": "hr@expro.com",
      "contact_phone": "8801712345678",
      "view_count": 350,
      "application_count": 25,
      "is_featured": true,
      "status": "published",
      "status_label": "Published",
      "posted_by": {
        "id": 1,
        "name": "HR Manager",
        "email": "hr@expro.com"
      },
      "created_at": "2024-03-01 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 15,
    "total": 20
  }
}
```

### Get Featured Careers (Public)

**Endpoint:** `GET /public/careers/featured`  
**Auth Required:** No

```javascript
const response = await api.get('/public/careers/featured');

// Returns up to 10 featured job postings
```

### Get Careers by Job Type (Public)

**Endpoint:** `GET /public/careers/type/{jobType}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/careers/type/full_time');

// Available types: full_time, part_time, contract, internship, remote
```

### Get Career Details (Public)

**Endpoint:** `GET /public/careers/{id}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/careers/1');

// Automatically increments view count
```

### Create Career (Admin Only)

**Endpoint:** `POST /career`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.post('/career', {
  title: 'Senior Software Engineer',
  slug: 'senior-software-engineer',
  description: 'Full job description...',
  responsibilities: 'Key responsibilities...',
  requirements: 'Required qualifications...',
  benefits: 'Benefits and perks...',
  department: 'IT',
  location: 'Dhaka',
  job_type: 'full_time',
  experience_level: 'senior',
  salary_min: 80000,
  salary_max: 120000,
  salary_currency: 'BDT',
  salary_negotiable: true,
  vacancies: 2,
  application_deadline: '2024-04-30',
  contact_email: 'hr@expro.com',
  contact_phone: '8801712345678',
  is_featured: true,
  status: 'published'
});
```

### Update Career (Admin Only)

**Endpoint:** `PUT /career/{id}`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.put('/career/1', {
  vacancies: 3,
  status: 'published',
  application_deadline: '2024-05-15'
});
```

### Delete Career (Admin Only)

**Endpoint:** `DELETE /career/{id}`  
**Auth Required:** Yes (Admin)

```javascript
await api.delete('/career/1');
```

### Career Applications

#### List All Applications

**Endpoint:** `GET /career-applications`  
**Auth Required:** Yes

```javascript
const response = await api.get('/career-applications', {
  params: { 
    page: 1,
    career_id: 1,
    status: 'pending' // pending, shortlisted, rejected, selected
  }
});
```

#### Get My Applications

**Endpoint:** `GET /career-applications/my`  
**Auth Required:** Yes

```javascript
const response = await api.get('/career-applications/my');
```

#### Get Application Details

**Endpoint:** `GET /career-application/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/career-application/1');
```

#### Submit Application

**Endpoint:** `POST /career-application`  
**Auth Required:** Yes

```javascript
const formData = new FormData();
formData.append('career_id', 1);
formData.append('full_name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('phone', '8801712345678');
formData.append('cover_letter', 'My cover letter...');
formData.append('resume', resumeFile); // PDF file
formData.append('portfolio_url', 'https://johndoe.com');
formData.append('linkedin_url', 'https://linkedin.com/in/johndoe');
formData.append('expected_salary', 100000);
formData.append('available_from', '2024-05-01');

const response = await api.post('/career-application', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

#### Update Application

**Endpoint:** `PUT /career-application/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.put('/career-application/1', {
  status: 'shortlisted',
  admin_notes: 'Good candidate for interview'
});
```

#### Delete Application

**Endpoint:** `DELETE /career-application/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/career-application/1');
```

#### Shortlist Application (Admin)

**Endpoint:** `POST /career-application/{id}/shortlist`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.post('/career-application/1/shortlist', {
  notes: 'Shortlisted for interview'
});
```

#### Reject Application (Admin)

**Endpoint:** `POST /career-application/{id}/reject`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.post('/career-application/1/reject', {
  reason: 'Does not meet minimum requirements'
});
```

#### Select Application (Admin)

**Endpoint:** `POST /career-application/{id}/select`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.post('/career-application/1/select', {
  notes: 'Selected for the position'
});
```

### Job Types

- `full_time` - Full Time
- `part_time` - Part Time
- `contract` - Contract
- `internship` - Internship
- `remote` - Remote

### Experience Levels

- `entry` - Entry Level
- `mid` - Mid Level
- `senior` - Senior Level
- `executive` - Executive Level

---

## Galleries

Gallery management system for organizing and displaying image collections with titles and descriptions.

### List All Galleries (Public)

**Endpoint:** `GET /public/galleries`  
**Auth Required:** No

```javascript
const response = await api.get('/public/galleries', {
  params: { 
    page: 1,
    per_page: 15,
    status: 'published',
    is_featured: true,
    search: 'event'
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Summer Events 2024",
      "slug": "summer-events-2024",
      "description": "Photos from summer events",
      "cover_image": "/storage/galleries/covers/cover.jpg",
      "view_count": 150,
      "is_featured": true,
      "status": "published",
      "status_label": "Published",
      "images_count": 12,
      "created_by": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@expro.com"
      },
      "created_at": "2024-03-01 10:00:00",
      "updated_at": "2024-03-01 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 40
  }
}
```

### Get Featured Galleries (Public)

**Endpoint:** `GET /public/galleries/featured`  
**Auth Required:** No

```javascript
const response = await api.get('/public/galleries/featured');

// Returns up to 10 featured galleries
```

### Get Gallery Details (Public)

**Endpoint:** `GET /public/galleries/{gallery}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/galleries/1');

// Response includes all images in the gallery
// Automatically increments view count
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Summer Events 2024",
    "slug": "summer-events-2024",
    "description": "Photos from summer events",
    "cover_image": "/storage/galleries/covers/cover.jpg",
    "view_count": 151,
    "is_featured": true,
    "status": "published",
    "status_label": "Published",
    "images_count": 12,
    "images": [
      {
        "id": 1,
        "gallery_id": 1,
        "image_path": "/storage/galleries/images/photo1.jpg",
        "title": "Event Opening",
        "description": "Opening ceremony photo",
        "display_order": 1,
        "created_at": "2024-03-01 10:30:00"
      }
    ],
    "created_at": "2024-03-01 10:00:00"
  }
}
```

### Get Gallery Images (Public)

**Endpoint:** `GET /public/galleries/{gallery}/images`  
**Auth Required:** No

```javascript
const response = await api.get('/public/galleries/1/images', {
  params: { 
    page: 1,
    per_page: 20,
    sort_by: 'recent' // or default (display_order)
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "gallery_id": 1,
      "image_path": "/storage/galleries/images/photo1.jpg",
      "title": "Event Opening",
      "description": "Opening ceremony photo",
      "display_order": 1,
      "created_at": "2024-03-01 10:30:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 12
  }
}
```

### Create Gallery (Admin Only)

**Endpoint:** `POST /gallery`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('title', 'Summer Events 2024');
formData.append('slug', 'summer-events-2024');
formData.append('description', 'Photos from summer events');
formData.append('cover_image', coverImageFile); // Optional
formData.append('is_featured', true);
formData.append('status', 'published');

const response = await api.post('/gallery', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Update Gallery (Admin Only)

**Endpoint:** `PUT /gallery/{gallery}`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('description', 'Updated description');
formData.append('cover_image', newCoverImageFile); // Optional
formData.append('is_featured', false);
formData.append('status', 'published');

const response = await api.post(`/gallery/1?_method=PUT`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Delete Gallery (Admin Only)

**Endpoint:** `DELETE /gallery/{gallery}`  
**Auth Required:** Yes (Admin)

```javascript
await api.delete('/gallery/1');

// Deletes gallery and all associated images
```

### Gallery Images Management

#### Add Image to Gallery (Admin Only)

**Endpoint:** `POST /gallery/{gallery}/images`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('image', imageFile); // Required
formData.append('title', 'Event Photo'); // Optional
formData.append('description', 'Photo description'); // Optional
formData.append('display_order', 1); // Optional

const response = await api.post('/gallery/1/images', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

#### Update Gallery Image (Admin Only)

**Endpoint:** `PUT /gallery/{gallery}/images/{image}`  
**Auth Required:** Yes (Admin)

```javascript
const formData = new FormData();
formData.append('image', newImageFile); // Optional
formData.append('title', 'Updated Title');
formData.append('description', 'Updated description');
formData.append('display_order', 2);

const response = await api.post(`/gallery/1/images/1?_method=PUT`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

#### Delete Gallery Image (Admin Only)

**Endpoint:** `DELETE /gallery/{gallery}/images/{image}`  
**Auth Required:** Yes (Admin)

```javascript
await api.delete('/gallery/1/images/1');
```

#### Reorder Gallery Images (Admin Only)

**Endpoint:** `POST /gallery/{gallery}/images/reorder`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.post('/gallery/1/images/reorder', {
  images: [
    { id: 1, display_order: 1 },
    { id: 2, display_order: 2 },
    { id: 3, display_order: 3 }
  ]
});
```

### Gallery Status

- `draft` - Draft gallery (not visible to public)
- `published` - Published gallery (visible to public)
- `archived` - Archived gallery (hidden from public)

---

## YouTube Videos

YouTube video management system for embedding and organizing YouTube videos with titles and descriptions.

### List All YouTube Videos (Public)

**Endpoint:** `GET /public/youtube-videos`  
**Auth Required:** No

```javascript
const response = await api.get('/public/youtube-videos', {
  params: { 
    page: 1,
    per_page: 15,
    status: 'published',
    is_featured: true,
    search: 'conference'
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Annual Conference 2024",
      "slug": "annual-conference-2024",
      "description": "Highlights from our annual conference",
      "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "youtube_video_id": "dQw4w9WgXcQ",
      "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "view_count": 250,
      "is_featured": true,
      "status": "published",
      "status_label": "Published",
      "created_by": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@expro.com"
      },
      "created_at": "2024-03-01 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 15,
    "total": 25
  }
}
```

### Get Featured YouTube Videos (Public)

**Endpoint:** `GET /public/youtube-videos/featured`  
**Auth Required:** No

```javascript
const response = await api.get('/public/youtube-videos/featured');

// Returns up to 10 featured videos
```

### Get YouTube Video Details (Public)

**Endpoint:** `GET /public/youtube-videos/{video}`  
**Auth Required:** No

```javascript
const response = await api.get('/public/youtube-videos/1');

// Automatically increments view count
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Annual Conference 2024",
    "slug": "annual-conference-2024",
    "description": "Highlights from our annual conference",
    "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "youtube_video_id": "dQw4w9WgXcQ",
    "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "view_count": 251,
    "is_featured": true,
    "status": "published",
    "status_label": "Published",
    "created_at": "2024-03-01 10:00:00"
  }
}
```

### Create YouTube Video (Admin Only)

**Endpoint:** `POST /youtube-video`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.post('/youtube-video', {
  title: 'Annual Conference 2024',
  slug: 'annual-conference-2024',
  description: 'Highlights from our annual conference',
  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  is_featured: true,
  status: 'published'
});

// Video ID and thumbnail URL are automatically extracted
```

### Update YouTube Video (Admin Only)

**Endpoint:** `PUT /youtube-video/{video}`  
**Auth Required:** Yes (Admin)

```javascript
const response = await api.put('/youtube-video/1', {
  title: 'Updated Title',
  description: 'Updated description',
  youtube_url: 'https://www.youtube.com/watch?v=newVideoId',
  is_featured: false,
  status: 'published'
});
```

### Delete YouTube Video (Admin Only)

**Endpoint:** `DELETE /youtube-video/{video}`  
**Auth Required:** Yes (Admin)

```javascript
await api.delete('/youtube-video/1');
```

### YouTube URL Formats

Supported YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

The system automatically:
- Extracts the 11-character video ID
- Generates thumbnail URL: `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`

### YouTube Video Status

- `draft` - Draft video (not visible to public)
- `published` - Published video (visible to public)
- `archived` - Archived video (hidden from public)

---

## Notifications

In-app notification system for real-time user notifications with WebSocket support.

### List All Notifications

**Endpoint:** `GET /notifications`  
**Auth Required:** Yes

```javascript
const response = await api.get('/notifications', {
  params: { 
    page: 1,
    per_page: 15,
    type: 'payment', // payment, membership, pension, commission, system, announcement
    is_read: false,
    is_archived: false
  }
});

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "payment",
      "type_label": "Payment",
      "title": "Payment Successful",
      "message": "Your payment of 5000 BDT has been processed successfully",
      "data": {
        "payment_id": 123,
        "amount": 5000,
        "transaction_id": "TXN123456"
      },
      "action_url": "/payments/123",
      "action_text": "View Payment",
      "icon": "payment",
      "is_read": false,
      "is_archived": false,
      "read_at": null,
      "created_at": "2024-03-25 10:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

### Get Unread Count

**Endpoint:** `GET /notifications/unread-count`  
**Auth Required:** Yes

```javascript
const response = await api.get('/notifications/unread-count');

// Response
{
  "success": true,
  "data": {
    "unread_count": 5
  }
}
```

### Get Recent Notifications

**Endpoint:** `GET /notifications/recent`  
**Auth Required:** Yes

```javascript
const response = await api.get('/notifications/recent', {
  params: { limit: 10 }
});

// Returns up to 10 most recent notifications
```

### Get Archived Notifications

**Endpoint:** `GET /notifications/archived`  
**Auth Required:** Yes

```javascript
const response = await api.get('/notifications/archived', {
  params: { page: 1, per_page: 15 }
});
```

### Get Notification Details

**Endpoint:** `GET /notifications/{id}`  
**Auth Required:** Yes

```javascript
const response = await api.get('/notifications/1');

// Automatically marks as read if unread
```

### Mark as Read

**Endpoint:** `PUT /notifications/{id}/read`  
**Auth Required:** Yes

```javascript
const response = await api.put('/notifications/1/read');

// Response
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark as Unread

**Endpoint:** `PUT /notifications/{id}/unread`  
**Auth Required:** Yes

```javascript
const response = await api.put('/notifications/1/unread');
```

### Mark All as Read

**Endpoint:** `PUT /notifications/mark-all-read`  
**Auth Required:** Yes

```javascript
const response = await api.put('/notifications/mark-all-read');

// Response
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updated_count": 5
  }
}
```

### Archive Notification

**Endpoint:** `PUT /notifications/{id}/archive`  
**Auth Required:** Yes

```javascript
const response = await api.put('/notifications/1/archive');
```

### Delete Notification

**Endpoint:** `DELETE /notifications/{id}`  
**Auth Required:** Yes

```javascript
await api.delete('/notifications/1');
```

### Notification Types

- `payment` - Payment related notifications
- `membership` - Membership related notifications
- `pension` - Pension related notifications
- `commission` - Commission related notifications
- `system` - System notifications
- `announcement` - Announcements

### Real-time Notifications (WebSocket)

For real-time notifications, connect to the WebSocket server:

```javascript
// Using Laravel Echo with Pusher
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.PUSHER_APP_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});

// Listen for notifications
window.Echo.private(`App.Models.User.${userId}`)
  .notification((notification) => {
    console.log('New notification:', notification);
    // Update UI with new notification
    // Play sound, show toast, etc.
  });
```

### Notification Data Structure

```javascript
{
  "id": 1,
  "type": "payment",
  "type_label": "Payment",
  "title": "Payment Successful",
  "message": "Your payment of 5000 BDT has been processed successfully",
  "data": {
    // Additional data specific to notification type
    "payment_id": 123,
    "amount": 5000,
    "transaction_id": "TXN123456"
  },
  "action_url": "/payments/123", // Optional URL for action button
  "action_text": "View Payment", // Optional text for action button
  "icon": "payment", // Icon identifier for UI
  "is_read": false,
  "is_archived": false,
  "read_at": null,
  "created_at": "2024-03-25 10:00:00"
}
```

---

## Admin Endpoints

All admin endpoints require `admin` role and are prefixed with `/admin`.

### List All Members

**Endpoint:** `GET /admin/members`  
**Auth Required:** Yes (Admin role)

```javascript
const response = await api.get('/admin/members', {
  params: { 
    page: 1,
    status: 'active',
    search: 'john'
  }
});
```

---

## Chairman Endpoints

All chairman endpoints require `chairman` role and are prefixed with `/chairman`.

### List All Members

**Endpoint:** `GET /chairman/members`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.get('/chairman/members', {
  params: { page: 1, status: 'pending' }
});
```

### Get Member Details

**Endpoint:** `GET /chairman/member/{id}`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.get('/chairman/member/1');
```

### Approve General Member

**Endpoint:** `POST /chairman/generalmemberapproval/{id}`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.post('/chairman/generalmemberapproval/1', {
  remarks: 'Approved for general membership'
});
```

### Reject General Member

**Endpoint:** `POST /chairman/generalmemberreject/{id}`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.post('/chairman/generalmemberreject/1', {
  reason: 'Incomplete documentation'
});
```

### Update User Status

**Endpoint:** `POST /chairman/user/{id}/update-status`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.post('/chairman/user/1/update-status', {
  status: 'active' // or 'inactive', 'suspended', 'pending'
});
```

### List All Roles

**Endpoint:** `GET /chairman/roles`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.get('/chairman/roles');
```

### Assign Role to User

**Endpoint:** `POST /chairman/assignRole`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.post('/chairman/assignRole', {
  user_id: 1,
  roles: ['member', 'coordinator']
});
```

### View Activity Log

**Endpoint:** `GET /chairman/activitylog`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.get('/chairman/activitylog', {
  params: { 
    page: 1,
    user_id: 1,
    from_date: '2024-01-01',
    to_date: '2024-12-31'
  }
});
```

### List All Wallets

**Endpoint:** `GET /chairman/wallets`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.get('/chairman/wallets', {
  params: { page: 1, status: 'active' }
});
```

### List All Wallet Transactions

**Endpoint:** `GET /chairman/wallettransactions`  
**Auth Required:** Yes (Chairman role)

```javascript
const response = await api.get('/chairman/wallettransactions', {
  params: { 
    page: 1,
    user_id: 1,
    type: 'credit',
    from_date: '2024-01-01'
  }
});
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "first_page_url": "http://localhost:8000/api/v1/endpoint?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://localhost:8000/api/v1/endpoint?page=5",
    "next_page_url": "http://localhost:8000/api/v1/endpoint?page=2",
    "path": "http://localhost:8000/api/v1/endpoint",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or token invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### Common Error Examples

#### Validation Error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

#### Authentication Error (401)

```json
{
  "message": "Unauthenticated."
}
```

#### Authorization Error (403)

```json
{
  "message": "This action is unauthorized."
}
```

#### Not Found Error (404)

```json
{
  "message": "Resource not found."
}
```

#### Rate Limit Error (429)

```json
{
  "message": "Too Many Attempts."
}
```

### Error Handling in Frontend

```javascript
// Using Axios interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Show permission denied message
          alert('You do not have permission to perform this action');
          break;
        case 422:
          // Handle validation errors
          const errors = error.response.data.errors;
          // Display errors to user
          break;
        case 429:
          // Rate limit exceeded
          alert('Too many requests. Please try again later.');
          break;
        default:
          // Generic error
          alert('An error occurred. Please try again.');
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Common Query Parameters

Most list endpoints support these query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number for pagination | `?page=2` |
| `per_page` | integer | Items per page (max: 100) | `?per_page=20` |
| `search` | string | Search term | `?search=john` |
| `sort_by` | string | Field to sort by | `?sort_by=created_at` |
| `sort_order` | string | Sort direction (asc/desc) | `?sort_order=desc` |
| `status` | string | Filter by status | `?status=active` |
| `from_date` | date | Start date (YYYY-MM-DD) | `?from_date=2024-01-01` |
| `to_date` | date | End date (YYYY-MM-DD) | `?to_date=2024-12-31` |

### Example Usage

```javascript
const response = await api.get('/pensionpackages', {
  params: {
    page: 2,
    per_page: 20,
    search: 'gold',
    sort_by: 'created_at',
    sort_order: 'desc',
    status: 'active'
  }
});
```

---

## Enums and Constants

### User Status
- `pending` - Awaiting approval
- `active` - Active user
- `inactive` - Inactive user
- `suspended` - Suspended user
- `rejected` - Rejected application

### Gender
- `male`
- `female`
- `other`

### Payment Status
- `pending` - Payment pending
- `processing` - Payment processing
- `completed` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

### Payment Method
- `cash`
- `bank_transfer`
- `bkash`
- `nagad`
- `rocket`
- `sslcommerz`

### Membership Type
- `general` - General member
- `life` - Life member
- `honorary` - Honorary member

### Commission Type
- `referral` - Referral commission
- `performance` - Performance commission
- `bonus` - Bonus commission

### Project Status
- `planning` - In planning phase
- `active` - Active project
- `in_progress` - Work in progress
- `completed` - Project completed
- `on_hold` - Project on hold
- `cancelled` - Project cancelled

### Event Status
- `upcoming` - Upcoming event
- `ongoing` - Event in progress
- `completed` - Event completed
- `cancelled` - Event cancelled

### Blog Post Status
- `draft` - Draft post
- `published` - Published post
- `archived` - Archived post

### Donation Type
- `general` - General donation
- `project` - Project-specific donation
- `emergency` - Emergency donation
- `zakat` - Zakat donation

### Document Type
- `profile` - Organization profile documents
- `awards` - Awards and recognition certificates
- `annual_reports` - Yearly financial and activity reports
- `rules` - Rules and regulations
- `organogram` - Organizational structure charts
- `magazine` - Newsletters and magazines
- `calendar` - Event calendars
- `notice` - Official notices and announcements
- `other` - Miscellaneous documents

### Document Status
- `active` - Document is visible and downloadable
- `inactive` - Document is hidden from public view
- `archived` - Document is archived but not deleted

### Notice Type
- `general` - General notices
- `urgent` - Urgent notices
- `circular` - Circulars
- `announcement` - Announcements

### Notice Priority
- `low` - Low priority
- `normal` - Normal priority
- `high` - High priority
- `urgent` - Urgent priority

### Notice Status
- `draft` - Draft notice
- `published` - Published notice
- `archived` - Archived notice

### Career Status
- `draft` - Draft job posting
- `published` - Published job posting
- `closed` - Applications closed
- `filled` - Position filled
- `archived` - Archived job posting

### Job Type
- `full_time` - Full Time
- `part_time` - Part Time
- `contract` - Contract
- `internship` - Internship
- `remote` - Remote

### Experience Level
- `entry` - Entry Level
- `mid` - Mid Level
- `senior` - Senior Level
- `executive` - Executive Level

### Application Status
- `pending` - Application pending review
- `shortlisted` - Shortlisted for interview
- `rejected` - Application rejected
- `selected` - Candidate selected

### Gallery Status
- `draft` - Draft gallery
- `published` - Published gallery
- `archived` - Archived gallery

### YouTube Video Status
- `draft` - Draft video
- `published` - Published video
- `archived` - Archived video

### Notification Type
- `payment` - Payment related notifications
- `membership` - Membership related notifications
- `pension` - Pension related notifications
- `commission` - Commission related notifications
- `system` - System notifications
- `announcement` - Announcements

---

## Best Practices

### 1. Token Management

```javascript
// Store token securely
localStorage.setItem('auth_token', token);

// Always include token in requests
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

// Clear token on logout
localStorage.removeItem('auth_token');
```

### 2. Error Handling

```javascript
try {
  const response = await api.post('/endpoint', data);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('Network error');
  } else {
    // Other errors
    console.error(error.message);
  }
}
```

### 3. Pagination Handling

```javascript
const [data, setData] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchData = async () => {
  const response = await api.get('/endpoint', {
    params: { page, per_page: 15 }
  });
  setData(response.data.data.data);
  setTotalPages(response.data.data.last_page);
};
```

### 4. File Uploads

```javascript
// For base64 encoded images
const uploadImage = async (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64 = reader.result;
    await api.post('/endpoint', {
      profile_photo: base64
    });
  };
};
```

### 5. Date Formatting

```javascript
// Always send dates in YYYY-MM-DD format
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Example
const data = {
  date_of_birth: formatDate(new Date('1990-01-15'))
};
```

---

## Support

For API support and questions:
- Email: support@expro.com
- Documentation: https://docs.expro.com
- GitHub: https://github.com/expro/backend

---

**Last Updated:** March 25, 2026  
**API Version:** 1.0.0
