# Pension Package Modal Update

## Summary
Updated the pension package create/edit modal to include all backend data fields except `status`, `created_at`, `updated_at`, and `deleted_at`.

## Backend to Frontend Field Mapping

| Backend Field | Frontend Form Field | Type | Required | Section |
|--------------|-------------------|------|----------|---------|
| `id` | - | Auto-generated | - | - |
| `name` | `packageName` | string | Yes | Package Details |
| `name_bangla` | `packageNameBangla` | string | No | Package Details |
| `slug` | `slug` | string | Yes | Package Details |
| `monthly_amount` | `monthlyFee` | number | Yes | Package Details |
| `total_installments` | `totalInstallments` | number | Yes | Package Details |
| `maturity_amount` | `maturity` | number | Yes | Maturity & Advance Settings |
| `joining_commission` | `joiningCommission` | number | Yes | Commission Structure |
| `installment_commission` | `installmentCommission` | number | Yes | Commission Structure |
| `max_advance_installments` | `maxAdvanceInstallments` | number | Yes | Maturity & Advance Settings |
| `allow_full_prepayment` | `allowFullPrepayment` | boolean | No | Prepayment Settings |
| `prepayment_discount_percentage` | `prepaymentDiscountPercentage` | number | Conditional* | Prepayment Settings |
| `maturity_on_schedule` | `maturityOnSchedule` | boolean | No | Prepayment Settings |
| `status` | - | Excluded | - | - |
| `is_active` | `isActive` | boolean | No | Package Status |
| `accepts_new_enrollment` | `acceptsNewEnrollment` | boolean | No | Package Status |
| `description` | `description` | text | No | Additional Information |
| `terms_conditions` | `termsConditions` | text | No | Additional Information |
| `created_at` | - | Excluded | - | - |
| `updated_at` | - | Excluded | - | - |
| `deleted_at` | - | Excluded | - | - |

*Required only when `allow_full_prepayment` is true

## Form Sections

### 1. Package Details
- Package Name (English) - Required
- Package Name (Bangla) - Optional
- Slug - Required (auto-generated from package name)
- Monthly Amount - Required
- Total Installments - Required

### 2. Maturity & Advance Settings
- Maturity Amount - Required
- Max Advance Installments - Required

### 3. Commission Structure
- Joining Commission - Required
- Installment Commission - Required

### 4. Prepayment Settings
- Allow Full Prepayment - Checkbox
- Prepayment Discount Percentage - Conditional (shown when prepayment is allowed)
- Maturity On Schedule - Checkbox

### 5. Package Status
- Is Active - Checkbox
- Accepts New Enrollment - Checkbox

### 6. Additional Information
- Description - Textarea (optional)
- Terms & Conditions - Textarea (optional)

## Features Implemented

1. **Auto-slug generation**: Slug is automatically generated from package name during creation
2. **Conditional validation**: Prepayment discount is required only when full prepayment is allowed
3. **Edit mode support**: All fields are properly populated when editing an existing package
4. **Proper data mapping**: Form data is correctly mapped to backend API format
5. **Error handling**: Field-level validation with error messages
6. **Loading states**: Disabled buttons and loading indicators during API calls

## Files Modified

- `app/(auth)/admin/pension-packages/new-package-modal.tsx` - Complete modal rewrite with all fields
