import { MemberProfile } from "./memberType";
import { Nominee } from "./nomineeType";

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
