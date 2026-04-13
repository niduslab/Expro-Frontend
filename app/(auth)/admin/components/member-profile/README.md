# Member Profile Components

This directory contains modular components for the member detail page with full CRUD functionality.

## Components

### Core Components

- **MemberHeader.tsx** - Displays member header with photo, name, status badges, and back/edit buttons
- **TabNavigation.tsx** - Tab navigation bar with counts for each section
- **shared.tsx** - Shared utility components like `InfoItem`

### Tab Components

- **ProfileTab.tsx** - Main profile view with personal info, contact, address, documents, wallet summary, membership info, and pension plans
- **PensionEnrollmentsTab.tsx** - Detailed view of all pension enrollments with progress bars and metrics
- **PensionInstallmentsTab.tsx** - Table view of all pension installments with payment status
- **WalletTab.tsx** - Detailed wallet information with all balances and status
- **WalletTransactionsTab.tsx** - Table view of all wallet transactions
- **NomineesTab.tsx** - Grid view of all nominees with add/edit/delete functionality

### Modal Components

- **EditProfileModal.tsx** - Modal for editing member profile information (admin only)
- **NomineeModal.tsx** - Modal for adding/editing nominees (admin only)

## Features

### Member Profile Management
- Admin can update any member's profile information
- Supports all profile fields including photo uploads
- Form validation and error handling
- Real-time updates with React Query

### Nominee Management
- View all nominees for a member
- Add new nominees with validation
- Edit existing nominee information
- Delete nominees with confirmation
- Primary nominee designation
- Percentage allocation tracking

## Usage

```tsx
import {
  MemberHeader,
  TabNavigation,
  ProfileTab,
  PensionEnrollmentsTab,
  PensionInstallmentsTab,
  WalletTab,
  WalletTransactionsTab,
  NomineesTab,
  EditProfileModal,
  NomineeModal,
  InfoItem
} from '@/app/(auth)/admin/components/member-profile';
```

## API Hooks

The components use the following hooks from `@/lib/hooks/admin/useMembers`:

- `useUpdateMemberProfile()` - Update member profile
- `useNominees(userId)` - Get user's nominees
- `useCreateNominee()` - Create new nominee
- `useUpdateNominee()` - Update existing nominee
- `useDeleteNominee()` - Delete nominee

## Structure

Each tab component is self-contained and receives only the data it needs:

- **ProfileTab**: Receives member, memberProfile, wallet, pensionEnrollments, nominees
- **PensionEnrollmentsTab**: Receives pensionEnrollments array
- **PensionInstallmentsTab**: Receives pensionInstallments array
- **WalletTab**: Receives wallet object
- **WalletTransactionsTab**: Receives walletTransactions array
- **NomineesTab**: Receives nominees array and userId for CRUD operations

This modular approach makes components:
- Easy to maintain
- Reusable across different pages
- Testable in isolation
- Simple to understand
- Fully functional with CRUD operations
