/**
 * Library Index
 * Central export point for all library modules
 * 
 * Usage:
 * import { useMyProfile, apiRequest, useAuth } from '@/lib';
 */

// API
export { apiClient, apiRequest, authUtils } from './api/axios';
export type { ApiResponse, PaginatedResponse, ApiError } from './api/axios';

// Hooks - Public
export {
  useMembershipApplications,
  useMembershipApplication,
  useSubmitMembershipApplication,
  useUpdateMembershipApplication,
  useDeleteMembershipApplication,
  useRegisterUser,
} from './hooks/public/useMembership';
export type {
  MembershipApplication,
  MembershipApplicationInput,
  MembershipApplicationsParams,
  RegisterUserInput,
  RegisterUserResponse,
} from './hooks/public/useMembership';

export { useBranches, useBranch } from './hooks/public/usePublicData';
export type { Branch } from './hooks/public/usePublicData';

// Hooks - User
export {
  useMyProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
} from './hooks/user/useProfile';
export type {
  UserProfile,
  CreateProfileInput,
  UpdateProfileInput,
} from './hooks/user/useProfile';

export { useMyWallet, useMyWalletTransactions } from './hooks/user/useWallet';
export type {
  Wallet,
  WalletTransaction,
  WalletTransactionsParams,
} from './hooks/user/useWallet';

// Hooks - Admin
export {
  useMembers,
  useMember,
  useUpdateMemberStatus,
} from './hooks/admin/useMembers';
export type { Member, MembersParams } from './hooks/admin/useMembers';

export { useDashboardStats } from './hooks/admin/useDashboard';
export type { DashboardStats } from './hooks/admin/useDashboard';

export { useDonations, useDonation } from './hooks/admin/useDonations';
export type { Donation, DonationsResponse, DonationsParams } from './hooks/admin/useDonations';

// Hooks - Utility
export { useGSAPInit } from './hooks/useGSAPInit';
export { usePageContent } from './hooks/usePageContent';
export { useTrackOrder } from './hooks/useTrackOrder';
export type { OrderStatus } from './hooks/useTrackOrder';

// Components
export { AuthGuard } from './components/AuthGuard';
export { CountdownTimer } from './components/CountdownTimer';
export { NotificationBell } from './components/NotificationBell';
export { OtpInput } from './components/OtpInput';
export { ToastProvider } from './components/ToastProvider';

// Context
export { AuthProvider, useAuth } from './context/AuthContext';
export { NotificationProvider, useNotification } from './context/NotificationContext';
export type { Notification } from './context/NotificationContext';
export { CartProvider, useCart } from './context/CartContext';
export type { CartItem } from './context/CartContext';

// Providers
export { AppProviders, QueryProvider } from './providers';
