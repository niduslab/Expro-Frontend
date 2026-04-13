// types/projectMember.ts

import { MemberProfile } from "./memberType";

export type ProjectMemberRole =
  | "chairman"
  | "admin"
  | "executive_member"
  | "project_presenter"
  | "assistant_pp"
  | "general_member";

export type ProjectMemberStatus =
  | "pending"
  | "active"
  | "inactive"
  | "suspended"
  | "expired";

// ─── Nested resources (minimal shapes) ──────────────────────────────────────

export interface ProjectMemberProject {
  id: number;
  name: string;
  // extend as your ProjectResource returns more fields
  [key: string]: unknown;
}

export interface ProjectMemberUser {
  id: number;
  name: string;
  email: string;
  member: MemberProfile;
  // extend as your UserResource returns more fields
  [key: string]: unknown;
}

// ─── Core entity ─────────────────────────────────────────────────────────────

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  project_role: ProjectMemberRole;
  parent_member_id: number | null;
  hierarchy_level: number;
  joining_fee_paid: string; // decimal string e.g. "60000.00"
  joining_date: string | null; // "YYYY-MM-DD"
  expiry_date: string | null; // "YYYY-MM-DD"
  status: ProjectMemberStatus;
  payment_id: number | null;
  max_downline_members: number | null;
  current_downline_count: number;
  notes: string | null;

  // Eager-loaded relations (present only when loaded)
  project?: ProjectMemberProject;
  user?: ProjectMemberUser;
  parent?: ProjectMember | null;

  created_at: string;
  updated_at: string;
}

// ─── Request payloads ────────────────────────────────────────────────────────

export interface CreateProjectMemberPayload {
  project_id: number;
  user_id: number;
  project_role: ProjectMemberRole;
  parent_member_id?: number | null;
  hierarchy_level: number;
  joining_fee_paid: number;
  joining_date: string; // "YYYY-MM-DD"
  expiry_date?: string | null;
  status: ProjectMemberStatus;
  payment_id?: number | null;
  max_downline_members?: number | null;
  current_downline_count: number;
  notes?: string | null;
}

export type UpdateProjectMemberPayload = CreateProjectMemberPayload;

// ─── Query / filter params ───────────────────────────────────────────────────

export interface ProjectMemberFilters {
  project_id?: number;
  user_id?: number;
  project_role?: ProjectMemberRole;
  status?: ProjectMemberStatus;
  joining_date?: string;
  expiry_date?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface MyProjectsFilters {
  project_id?: number;
  project_role?: ProjectMemberRole;
  status?: ProjectMemberStatus;
  joining_date?: string;
  expiry_date?: string;
  page?: number;
  per_page?: number;
}
