import { Branch } from "../branchType";
import { MemberProfile } from "./memberType";
import { Nominee } from "./nomineeType";
import { PensionEnrollment, PensionInstallment } from "./pensionsType";
import { Wallet, WalletTransaction } from "./walletsType";

// User (lightweight)
export interface UserListItem {
  id: number;
  email: string;
  status: string;
  last_login_at: string | null;
  roles: string[];
  permissions: string[];
  member: MemberProfile;
  nominee: Nominee[];
  wallet: Wallet | null;
  wallet_transactions: WalletTransaction[];
  pension_enrollments: PensionEnrollment[];
  pension_installments: PensionInstallment[];
  branch: Branch | null;
}

// Pagination
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// Full API response
export interface UsersResponse {
  success: boolean;
  message: string;
  data: UserListItem[];
  pagination: Pagination;
}

// ---------------------------------------------------------------------------
// System (back-office) users
// ---------------------------------------------------------------------------

// A back-office/staff user as returned by GET /admin/system-users
export interface SystemUser {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  status: string;
  member_id: string | null;
  branch: string | null;
  last_login_at: string | null;
  roles: string[];
  permissions: string[];
}

export interface SystemUsersResponse {
  success: boolean;
  message: string;
  data: SystemUser[];
  pagination: Pagination;
}

// Payload for POST /admin/create-system-user
export interface CreateSystemUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  branch_id?: number;
  roles: string[];
}

export interface CreateSystemUserResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
    roles: string[];
  };
}

// Payload for PUT /admin/system-users/{id}
export interface UpdateSystemUserRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string | null;
  status?: string;
  branch_id?: number | null;
}

// Payload for POST /admin/system-users/{id}/change-password
export interface ChangeUserPasswordRequest {
  id: number;
  password: string;
  password_confirmation: string;
}
