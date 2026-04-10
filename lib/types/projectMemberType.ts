/**
 * Project Member Types
 * Based on project_members migration schema + real API response
 */

export type ProjectRole =
  | "chairman"
  | "admin"
  | "executive_member"
  | "project_presenter"
  | "assistant_pp"
  | "general_member";

export type MemberStatus =
  | "pending"
  | "active"
  | "inactive"
  | "suspended"
  | "expired";

// ─── Relationships ────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  title_bangla?: string;
  slug: string;
  category?: string;
  short_description?: string;
  description?: string;
  featured_image?: string;
  gallery?: string[];
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: string; // decimal string from Laravel
  funds_raised?: string;
  funds_utilized?: string;
  project_lead_id?: number;
  is_featured?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  status?: string;
  last_login_at?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

// ─── Core entity ──────────────────────────────────────────────────────────────

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  project_role: ProjectRole;
  parent_member_id: number | null;
  hierarchy_level: number;
  joining_fee_paid: string; // decimal string from Laravel
  joining_date: string; // YYYY-MM-DD
  expiry_date: string | null;
  status: MemberStatus;
  payment_id: number | null;
  max_downline_members: number | null;
  current_downline_count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // Eager-loaded relationships
  project?: Project;
  user?: User;
}

// ─── Query / Filter Params ────────────────────────────────────────────────────

export interface MyProjectsParams {
  project_id?: number;
  project_role?: ProjectRole;
  status?: MemberStatus;
  joining_date?: string;
  expiry_date?: string;
  page?: number;
  per_page?: number;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface MyProjectsResponse {
  success: boolean;
  message: string;
  data: ProjectMember[];
  pagination: Pagination;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  chairman: "Chairman",
  admin: "Admin",
  executive_member: "Executive Member",
  project_presenter: "Project Presenter",
  assistant_pp: "Assistant PP",
  general_member: "General Member",
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  pending: "Pending",
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  expired: "Expired",
};

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { fetchMyProjects } from "@/lib/api/functions/user/myProjectsApi";

export {
  myProjectsKeys,
  useMyProjects,
  useMyProjectsInfinite,
  flattenInfiniteMyProjects,
} from "@/lib/hooks/user/useProject";
