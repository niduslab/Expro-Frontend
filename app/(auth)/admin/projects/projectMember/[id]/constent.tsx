// constants/projectMember.constants.ts

import type {
  ProjectMemberRole,
  ProjectMemberStatus,
  CreateProjectMemberPayload,
} from "@/lib/types/admin/projectMemberType";

// ─── Role Config ─────────────────────────────────────────────────────────────

export const ROLE_CONFIG: Record<
  ProjectMemberRole,
  { label: string; color: string; bg: string }
> = {
  chairman: {
    label: "Chairman",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  admin: {
    label: "Admin",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  executive_member: {
    label: "Executive Member",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  project_presenter: {
    label: "Project Presenter",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
  },
  assistant_pp: {
    label: "Assistant PP",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
  general_member: {
    label: "General Member",
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
  },
};

// ─── Status Config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  ProjectMemberStatus,
  { label: string; dot: string; text: string }
> = {
  active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-700" },
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-700" },
  inactive: { label: "Inactive", dot: "bg-slate-400", text: "text-slate-600" },
  suspended: { label: "Suspended", dot: "bg-red-500", text: "text-red-700" },
  expired: { label: "Expired", dot: "bg-orange-400", text: "text-orange-700" },
};

// ─── Select Options ───────────────────────────────────────────────────────────

export const ROLE_OPTIONS = Object.entries(ROLE_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, cfg]) => ({
    value,
    label: cfg.label,
  }),
);

// ─── Empty Form ───────────────────────────────────────────────────────────────

export const EMPTY_FORM: CreateProjectMemberPayload = {
  project_id: 0,
  user_id: 0,
  project_role: "general_member",
  parent_member_id: null,
  hierarchy_level: 5,
  joining_fee_paid: 0,
  joining_date: new Date().toISOString().split("T")[0],
  expiry_date: null,
  status: "pending",
  payment_id: null,
  max_downline_members: null,
  current_downline_count: 0,
  notes: null,
};
