# Account Transfer Request Modal - Enhanced Implementation

## Overview
Updated the RequestTransferModal to collect comprehensive new member information including personal details, address, and nominee information using the same data structure as the membership registration form.

## Changes Made

### 1. Extended Form Structure
The modal now has **6 steps** instead of 3:
1. **Select Enrollment** - Choose pension enrollment to transfer
2. **Transfer Reason** - Provide reason and details for transfer
3. **Personal Information** - New member's personal details
4. **Address Information** - Contact and location details
5. **Nominee Information** - Beneficiary details
6. **Review & Submit** - Final review and document upload

### 2. Data Structure
Integrated the same type definitions used in membership registration:
- `PersonalInfoState` - Personal information including:
  - Name (Bangla & English)
  - Father's/Husband's name
  - Mother's name
  - Date of birth
  - NID
  - Academic qualifications
  - Photo, NID photos (front/back), signature

- `AddressFormState` - Address and contact information:
  - Permanent address
  - Present address
  - Mobile number
  - Email
  - Religion
  - Gender

- `NomineeInfoState` - Nominee information:
  - Name (Bangla & English)
  - Date of birth
  - Relation to applicant
  - NID
  - Mobile
  - Address
  - Photo

### 3. Form Submission
The `handleSubmit` function now sends comprehensive data to the backend:
- All personal information fields
- All address fields
- All nominee fields
- All document uploads (photo, NID front/back, signature, nominee photo)
- Transfer reason and details
- Supporting documents

### 4. Field Mapping for Backend
The form data is mapped to backend-expected field names:
```
Personal Info:
- new_member_name_bangla
- new_member_name_english
- new_member_father_husband_name
- new_member_mother_name
- new_member_date_of_birth
- new_member_nid
- new_member_qualification (JSON array)
- new_member_photo (file)
- new_member_nid_front (file)
- new_member_nid_back (file)
- new_member_signature (file)

Address Info:
- new_member_permanent_address
- new_member_present_address
- new_member_mobile
- new_member_email
- new_member_religion
- new_member_gender

Nominee Info:
- nominee_name_bangla
- nominee_name_english
- nominee_dob
- nominee_relation
- nominee_nid
- nominee_mobile
- nominee_address
- nominee_photo (file)
```

### 5. UI/UX Improvements
- Progress bar shows all 6 steps
- Each step has clear instructions and validation
- Consistent styling with the rest of the application
- Responsive design for mobile and desktop
- File upload fields for all required documents
- Multi-select for academic qualifications
- Dropdown selects for religion and gender

### 6. Validation
Each step validates required fields before allowing progression:
- Step 1: Enrollment selected and eligible
- Step 2: Transfer reason and details provided
- Steps 3-5: All required fields filled (enforced by HTML5 `required` attribute)
- Step 6: Final review before submission

## Backend Requirements
The backend API endpoint should be updated to accept these additional fields. The current implementation sends all data via FormData, which the backend can process.

## Testing Checklist
- [ ] Select enrollment and verify eligibility check
- [ ] Fill transfer reason and details
- [ ] Complete personal information with all documents
- [ ] Complete address information
- [ ] Complete nominee information with photo
- [ ] Review all information in final step
- [ ] Submit and verify data is sent correctly
- [ ] Test validation on each step
- [ ] Test file upload for all document fields
- [ ] Test responsive design on mobile

## Notes
- All file uploads are required except supporting documents in the final step
- Academic qualifications allow multiple selections
- The form maintains consistency with the membership registration flow
- TypeScript types are imported from the membership components for type safety
