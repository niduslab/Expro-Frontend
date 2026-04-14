import { apiRequest, ApiResponse } from "@/lib/api/axios";

/**
 * Pension Team Hierarchy Types
 */

export interface TeamMemberEnrollment {
  id: number;
  enrollment_number: string;
  status: string;
  enrollment_date?: string;
  installments_paid: number;
  installments_remaining?: number;
}

export interface TeamMemberPackage {
  id: number;
  name: string;
  monthly_amount: number;
  maturity_amount?: number;
}

export interface TeamMemberCollection {
  current_month: number;
  current_month_installments?: number;
  total_paid: number;
}

export interface TeamMember {
  user_id: number;
  member_id: string;
  name_english: string;
  name_bangla?: string;
  email: string;
  mobile: string;
  level: number;
  role: string;
  enrollment: TeamMemberEnrollment;
  package: TeamMemberPackage;
  collection: TeamMemberCollection;
  children?: TeamMember[];
}

export interface HierarchyTreeData {
  tree: TeamMember[];
  totals: {
    total_members: number;
    total_collection: number;
    total_installments: number;
    by_level: Record<string, { members: number; collection: number }>;
    by_role: Record<string, number>;
  };
  period: string;
}

export interface TeamMemberListItem {
  hierarchy_id: number;
  level: number;
  user_id: number;
  member_id: string;
  name_english: string;
  email: string;
  mobile: string;
  enrollment: TeamMemberEnrollment;
  package: TeamMemberPackage;
  collection: TeamMemberCollection;
  role: string;
}

export interface TeamMembersParams {
  month?: string;
  level?: number;
  role?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface TeamStats {
  total_members: number;
  direct_members: number;
  by_level: Record<string, number>;
  by_role: Record<string, number>;
  by_status: Record<string, number>;
}

export interface CollectionByLevel {
  level: number;
  collection: number;
  installments: number;
  members: number;
}

export interface CollectionByMember {
  user_id: number;
  member_id: string;
  name: string;
  collection: number;
  installments: number;
}

export interface TeamCollections {
  period: string;
  period_start: string;
  period_end: string;
  total_collection: number;
  total_installments: number;
  active_members: number;
  by_level: CollectionByLevel[];
  by_member: CollectionByMember[];
}

export interface UplineMember {
  level: number;
  user_id: number;
  member_id: string;
  name: string;
  role: string;
  enrollment_id: number;
}

export interface RecentPayment {
  installment_number: number;
  amount_paid: number;
  paid_date: string;
}

export interface MemberDetails {
  hierarchy: {
    level: number;
    role_in_hierarchy: string;
  };
  user: {
    id: number;
    email: string;
    status: string;
  };
  member: {
    member_id: string;
    name_english: string;
    mobile: string;
  };
  enrollment: {
    enrollment_number: string;
    status: string;
    installments_paid: number;
    next_due_date?: string;
  };
  package: {
    name: string;
    monthly_amount: number;
  };
  recent_payments: RecentPayment[];
  member_team_stats: {
    total_members: number;
    direct_members: number;
  };
}

/**
 * Get complete team hierarchy as nested tree with all stats and collections
 * 
 * GET /pension/team/hierarchy-tree
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns Complete hierarchy tree with totals
 */
export const getTeamHierarchyTree = async (
  month?: string
): Promise<ApiResponse<HierarchyTreeData>> => {
  const response = await apiRequest.get<HierarchyTreeData>(
    "/pension/team/hierarchy-tree",
    { params: { month } }
  );
  return response.data;
};

/**
 * Get paginated list of all team members with filters
 * 
 * GET /pension/team/members
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of team members
 */
export const getTeamMembers = async (
  params?: TeamMembersParams
): Promise<ApiResponse<TeamMemberListItem[]>> => {
  const response = await apiRequest.get<TeamMemberListItem[]>(
    "/pension/team/members",
    { params }
  );
  return response.data;
};

/**
 * Get only direct team members (level 1)
 * 
 * GET /pension/team/direct-members
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns List of direct team members
 */
export const getDirectTeamMembers = async (
  month?: string
): Promise<ApiResponse<TeamMemberListItem[]>> => {
  const response = await apiRequest.get<TeamMemberListItem[]>(
    "/pension/team/direct-members",
    { params: { month } }
  );
  return response.data;
};

/**
 * Get team statistics only (no collection data)
 * 
 * GET /pension/team/stats
 * 
 * @returns Team statistics
 */
export const getTeamStats = async (): Promise<ApiResponse<TeamStats>> => {
  const response = await apiRequest.get<TeamStats>("/pension/team/stats");
  return response.data;
};

/**
 * Get monthly collection summary
 * 
 * GET /pension/team/collections
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns Collection summary
 */
export const getTeamCollections = async (
  month?: string
): Promise<ApiResponse<TeamCollections>> => {
  const response = await apiRequest.get<TeamCollections>(
    "/pension/team/collections",
    { params: { month } }
  );
  return response.data;
};

/**
 * Get your upline sponsors chain
 * 
 * GET /pension/team/upline
 * 
 * @returns List of upline members
 */
export const getTeamUpline = async (): Promise<
  ApiResponse<{ data: UplineMember[]; total_levels: number }>
> => {
  const response = await apiRequest.get<{
    data: UplineMember[];
    total_levels: number;
  }>("/pension/team/upline");
  return response.data;
};

/**
 * Get detailed information about a specific team member
 * 
 * GET /pension/team/member/{userId}/details
 * 
 * @param userId - User ID
 * @returns Member details
 */
export const getTeamMemberDetails = async (
  userId: number
): Promise<ApiResponse<MemberDetails>> => {
  const response = await apiRequest.get<MemberDetails>(
    `/pension/team/member/${userId}/details`
  );
  return response.data;
};

/**
 * Commission Types
 */

export interface CommissionSourceUser {
  id: number;
  name: string;
}

export interface Commission {
  id: number;
  type: string;
  amount: number;
  status: string;
  description: string;
  source_user?: CommissionSourceUser;
  wallet_transaction_id?: number;
  created_at: string;
  approved_at?: string;
  credited_at?: string;
  rejected_at?: string;
}

export interface CommissionsParams {
  type?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface CommissionsByType {
  total: number;
  count: number;
}

export interface CommissionsByStatus {
  total: number;
  count: number;
}

export interface CommissionStats {
  period?: string;
  summary: {
    total_commissions: number;
    total_count: number;
    credited_amount: number;
    pending_amount: number;
    approved_amount: number;
  };
  by_type: Record<string, CommissionsByType>;
  by_status: Record<string, CommissionsByStatus>;
}

/**
 * Get all commissions for the current user (paginated)
 * 
 * GET /my-commissions
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of commissions
 */
export const getMyCommissions = async (
  params?: CommissionsParams
): Promise<ApiResponse<Commission[]>> => {
  const response = await apiRequest.get<Commission[]>(
    "/my-commissions",
    { params }
  );
  return response.data;
};

/**
 * Get commission statistics for the current user
 * 
 * GET /my-commission-stats
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns Commission statistics
 */
export const getMyCommissionStats = async (
  month?: string
): Promise<ApiResponse<CommissionStats>> => {
  const response = await apiRequest.get<CommissionStats>(
    "/my-commission-stats",
    { params: { month } }
  );
  return response.data;
};
