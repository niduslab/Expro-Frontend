# Pension Investment API Documentation

## Overview

The Pension Investment API manages pension fund investments across different sectors and handles profit distribution to pension members when investments mature or generate profits.

## Investment Sectors

The system allocates pension funds across four sectors:

1. **Productive (40%)** - Manufacturing, Agriculture
2. **Service (35%)** - Healthcare, Education
3. **Income Project (20%)** - Real Estate, Trading
4. **Reserve (5%)** - Reserve Fund

## Key Features

- ✅ Investment tracking across multiple sectors
- ✅ ROI and performance monitoring
- ✅ Automatic profit distribution to pension members
- ✅ Wallet integration for profit payments
- ✅ Risk assessment and management
- ✅ Investment valuation updates
- ✅ Comprehensive statistics and reporting

---

## API Endpoints

### Public Endpoints

#### 1. Get All Investments (Public)
```http
GET /api/v1/public/pension-investments
```

**Query Parameters:**
- `sector` - Filter by sector (productive, service, income_project, reserve)
- `status` - Filter by status (active, matured, closed, underperforming, defaulted)
- `risk_level` - Filter by risk (low, medium, high)
- `active_only` - Boolean, show only active investments
- `mature_only` - Boolean, show only mature investments
- `search` - Search by name, code, or sub-sector
- `sort_by` - Sort field (default: created_at)
- `sort_order` - Sort direction (asc/desc, default: desc)
- `per_page` - Items per page (default: 15)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "investment_code": "INV-2026-001",
        "investment_name": "Healthcare Clinic - Dhaka",
        "investment_name_bangla": "স্বাস্থ্যসেবা ক্লিনিক - ঢাকা",
        "sector": "service",
        "sub_sector": "Healthcare",
        "amount_invested": "5000000.00",
        "current_value": "5500000.00",
        "profit_generated": "500000.00",
        "monthly_return": "41666.67",
        "roi_percentage": "10.0000",
        "investment_date": "2026-01-01",
        "maturity_date": "2028-01-01",
        "investment_duration_months": 24,
        "status": "active",
        "expected_return_percentage": "12.0000",
        "actual_return_percentage": "10.0000",
        "last_valuation_date": "2026-04-01",
        "risk_level": "medium",
        "is_mature": false,
        "days_to_maturity": 625,
        "performance_status": "good",
        "manager": {
          "id": 1,
          "name": "Admin User",
          "email": "admin@example.com"
        }
      }
    ],
    "total": 10
  }
}
```

#### 2. Get Investment Details (Public)
```http
GET /api/v1/public/pension-investment/{id}
```

#### 3. Get Investment Statistics (Public)
```http
GET /api/v1/public/pension-investments/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_investments": 25,
    "active_investments": 18,
    "mature_investments": 5,
    "total_invested": "50000000.00",
    "current_value": "55000000.00",
    "total_profit": "5000000.00",
    "average_roi": "10.5000",
    "by_sector": [
      {
        "sector": "productive",
        "count": 10,
        "total_invested": "20000000.00",
        "total_profit": "2000000.00"
      },
      {
        "sector": "service",
        "count": 8,
        "total_invested": "17500000.00",
        "total_profit": "1750000.00"
      }
    ],
    "by_status": [
      {
        "status": "active",
        "count": 18
      },
      {
        "status": "matured",
        "count": 5
      }
    ],
    "by_risk_level": [
      {
        "risk_level": "low",
        "count": 8,
        "total_invested": "15000000.00"
      },
      {
        "risk_level": "medium",
        "count": 12,
        "total_invested": "25000000.00"
      },
      {
        "risk_level": "high",
        "count": 5,
        "total_invested": "10000000.00"
      }
    ]
  }
}
```

---

### Authenticated Endpoints

#### 4. Create Investment (Admin)
```http
POST /api/v1/pension-investments
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "investment_name": "Manufacturing Plant - Chittagong",
  "investment_name_bangla": "উৎপাদন কারখানা - চট্টগ্রাম",
  "sector": "productive",
  "sub_sector": "Manufacturing",
  "amount_invested": 10000000,
  "investment_date": "2026-04-15",
  "maturity_date": "2028-04-15",
  "investment_duration_months": 24,
  "expected_return_percentage": 15,
  "risk_level": "medium",
  "description": "Textile manufacturing plant investment",
  "terms_conditions": "Standard investment terms apply",
  "documents": [
    "https://example.com/docs/investment-agreement.pdf",
    "https://example.com/docs/feasibility-study.pdf"
  ],
  "managed_by": 5,
  "notes": "Initial investment in textile sector"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pension investment created successfully",
  "data": {
    "id": 26,
    "investment_code": "INV-2026-026",
    "investment_name": "Manufacturing Plant - Chittagong",
    "sector": "productive",
    "amount_invested": "10000000.00",
    "current_value": "10000000.00",
    "status": "active",
    "created_at": "2026-04-15T10:30:00.000000Z"
  }
}
```

#### 5. Update Investment
```http
PUT /api/v1/pension-investments/{id}
Authorization: Bearer {token}
```

**Request Body:** (All fields optional)
```json
{
  "investment_name": "Updated Investment Name",
  "current_value": 11000000,
  "status": "active",
  "notes": "Updated investment details"
}
```

#### 6. Update Investment Valuation
```http
POST /api/v1/pension-investments/{id}/update-valuation
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "current_value": 11500000,
  "notes": "Q2 2026 valuation update"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment valuation updated successfully",
  "data": {
    "id": 1,
    "current_value": "11500000.00",
    "profit_generated": "1500000.00",
    "roi_percentage": "15.0000",
    "actual_return_percentage": "15.0000",
    "last_valuation_date": "2026-04-15"
  }
}
```

#### 7. Approve Investment
```http
POST /api/v1/pension-investments/{id}/approve
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment approved successfully",
  "data": {
    "id": 1,
    "approved_by": 1,
    "approved_at": "2026-04-15T10:30:00.000000Z"
  }
}
```

#### 8. Distribute Profits to Members
```http
POST /api/v1/pension-investments/{id}/distribute-profits
Authorization: Bearer {token}
```

**Description:** Creates profit distribution records for all completed pension enrollments based on their contribution ratio.

**Response:**
```json
{
  "success": true,
  "message": "Profit distribution created successfully",
  "data": {
    "total_distributions": 150,
    "total_profit_distributed": "1500000.00",
    "distributions": [
      {
        "id": 1,
        "pension_investment_id": 1,
        "pension_enrollment_id": 45,
        "user_id": 123,
        "investment_amount_basis": "50000.00",
        "profit_share_amount": "5000.00",
        "distribution_percentage": "0.3333",
        "distribution_date": "2026-04-15",
        "status": "pending"
      }
    ]
  }
}
```

#### 9. Process Profit Distribution Payments
```http
POST /api/v1/pension-investments/{id}/process-distributions
Authorization: Bearer {token}
```

**Description:** Processes all pending profit distributions by crediting member wallets.

**Response:**
```json
{
  "success": true,
  "message": "Profit distributions processed",
  "data": {
    "total": 150,
    "processed": 148,
    "failed": 2
  }
}
```

#### 10. Get My Profit Distributions (Member)
```http
GET /api/v1/pension-investments/my-profit-distributions
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` - Filter by status (pending, processing, completed, failed)
- `sort_by` - Sort field (default: distribution_date)
- `sort_order` - Sort direction (default: desc)
- `per_page` - Items per page (default: 15)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "pension_investment": {
          "id": 1,
          "investment_code": "INV-2026-001",
          "investment_name": "Healthcare Clinic - Dhaka",
          "sector": "service"
        },
        "pension_enrollment": {
          "id": 45,
          "enrollment_number": "EWF-2026-00045"
        },
        "investment_amount_basis": "50000.00",
        "profit_share_amount": "5000.00",
        "distribution_percentage": "0.3333",
        "distribution_date": "2026-04-15",
        "status": "completed",
        "payment_method": "wallet",
        "transaction_reference": "TXN-2026-001234",
        "paid_at": "2026-04-15T11:00:00.000000Z",
        "wallet_transaction": {
          "id": 567,
          "transaction_id": "TXN-2026-001234",
          "amount": "5000.00"
        }
      }
    ],
    "total": 5
  },
  "totals": {
    "total_profit_received": "25000.00",
    "total_paid": "20000.00",
    "total_pending": "5000.00"
  }
}
```

#### 11. Delete Investment
```http
DELETE /api/v1/pension-investments/{id}
Authorization: Bearer {token}
```

---

## Profit Distribution Logic

### How Profit Sharing Works

1. **Investment Matures or Generates Profit**
   - Admin updates investment valuation
   - System calculates profit generated

2. **Create Profit Distributions**
   - Call `/api/v1/pension-investments/{id}/distribute-profits`
   - System finds all completed pension enrollments
   - Calculates each member's share based on their contribution ratio

3. **Calculation Formula**
   ```
   Member's Share = (Member's Total Paid / Total Invested by All Members) × Total Profit
   ```

4. **Process Payments**
   - Call `/api/v1/pension-investments/{id}/process-distributions`
   - System credits each member's wallet
   - Creates wallet transaction records
   - Sends notifications to members

### Example Calculation

**Investment Details:**
- Total Profit: ৳1,000,000
- Total Invested by All Members: ৳10,000,000

**Member A:**
- Total Paid: ৳50,000
- Contribution Ratio: 50,000 / 10,000,000 = 0.005 (0.5%)
- Profit Share: 1,000,000 × 0.005 = ৳5,000

**Member B:**
- Total Paid: ৳100,000
- Contribution Ratio: 100,000 / 10,000,000 = 0.01 (1%)
- Profit Share: 1,000,000 × 0.01 = ৳10,000

---

## Investment Status Flow

```
active → matured → closed
   ↓
underperforming
   ↓
defaulted
```

- **active**: Currently invested and performing
- **matured**: Investment period completed successfully
- **closed**: Investment closed/withdrawn
- **underperforming**: Below expected returns (< 50% of expected ROI)
- **defaulted**: Investment failed

---

## Risk Levels

- **low**: Conservative investments with stable returns
- **medium**: Balanced risk-reward investments
- **high**: Aggressive investments with higher potential returns

---

## Database Schema

### pension_investments
- `id` - Primary key
- `investment_code` - Unique code (e.g., INV-2026-001)
- `investment_name` - Investment name
- `sector` - Investment sector (productive, service, income_project, reserve)
- `amount_invested` - Initial investment amount
- `current_value` - Current market value
- `profit_generated` - Total profit to date
- `roi_percentage` - Return on Investment %
- `status` - Investment status
- `managed_by` - Manager user ID
- `approved_by` - Approver user ID

### pension_investment_profit_distributions
- `id` - Primary key
- `pension_investment_id` - Investment reference
- `pension_enrollment_id` - Member enrollment reference
- `user_id` - Member user ID
- `investment_amount_basis` - Member's total pension investment
- `profit_share_amount` - Member's profit share
- `distribution_percentage` - % of total profit
- `status` - Distribution status (pending, processing, completed, failed)
- `wallet_transaction_id` - Wallet transaction reference

---

## Notifications

Members receive notifications when:
- ✅ Profit distribution is created (pending)
- ✅ Profit is credited to their wallet (completed)
- ✅ Distribution fails (failed)

---

## Authorization

- **Public**: View investments and statistics
- **Member**: View own profit distributions
- **Admin**: Full CRUD operations, approve investments, distribute profits

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Testing

### Create Test Investment
```bash
curl -X POST http://localhost:8000/api/v1/pension-investments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "investment_name": "Test Healthcare Clinic",
    "sector": "service",
    "amount_invested": 5000000,
    "investment_date": "2026-04-15",
    "risk_level": "medium"
  }'
```

### Update Valuation
```bash
curl -X POST http://localhost:8000/api/v1/pension-investments/1/update-valuation \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_value": 5500000,
    "notes": "Q2 valuation update"
  }'
```

### Distribute Profits
```bash
curl -X POST http://localhost:8000/api/v1/pension-investments/1/distribute-profits \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Process Distributions
```bash
curl -X POST http://localhost:8000/api/v1/pension-investments/1/process-distributions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Integration

### Display Investment List
```javascript
const fetchInvestments = async () => {
  const response = await fetch('/api/v1/public/pension-investments?sector=service&active_only=true');
  const data = await response.json();
  return data.data;
};
```

### Display Member's Profit History
```javascript
const fetchMyProfits = async (token) => {
  const response = await fetch('/api/v1/pension-investments/my-profit-distributions', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
};
```

---

## Best Practices

1. **Regular Valuation Updates**: Update investment valuations quarterly
2. **Profit Distribution**: Distribute profits when investments mature or generate significant returns
3. **Risk Management**: Monitor underperforming investments and take corrective action
4. **Member Communication**: Notify members about profit distributions promptly
5. **Audit Trail**: Maintain detailed notes for all valuation updates and distributions

---

## Support

For questions or issues, contact the development team or refer to the main API documentation.
