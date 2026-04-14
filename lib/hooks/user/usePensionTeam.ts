import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/lib/api/axios";
import {
  getTeamHierarchyTree,
  getTeamMembers,
  getDirectTeamMembers,
  getTeamStats,
  getTeamCollections,
  getTeamUpline,
  getTeamMemberDetails,
  HierarchyTreeData,
  TeamMemberListItem,
  TeamMembersParams,
  TeamStats,
  TeamCollections,
  UplineMember,
  MemberDetails,
} from "@/lib/api/functions/user/pensionTeamApi";

/**
 * Hook: Get Team Hierarchy Tree
 * Fetches complete team hierarchy as nested tree with all stats and collections
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns React Query result with hierarchy tree data
 * 
 * @example
 * const { data, isLoading } = useTeamHierarchyTree('2026-04');
 * const tree = data?.data.tree;
 * const totals = data?.data.totals;
 */
export const useTeamHierarchyTree = (month?: string) => {
  return useQuery<ApiResponse<HierarchyTreeData>, AxiosError>({
    queryKey: ["pensionTeamHierarchyTree", month],
    queryFn: () => getTeamHierarchyTree(month),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get Team Members
 * Fetches paginated list of all team members with filters
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns React Query result with team members list
 * 
 * @example
 * const { data, isLoading } = useTeamMembers({ 
 *   level: 1, 
 *   page: 1, 
 *   per_page: 20 
 * });
 */
export const useTeamMembers = (params?: TeamMembersParams) => {
  return useQuery<ApiResponse<TeamMemberListItem[]>, AxiosError>({
    queryKey: ["pensionTeamMembers", params],
    queryFn: () => getTeamMembers(params),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Direct Team Members
 * Fetches only direct team members (level 1)
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns React Query result with direct team members
 * 
 * @example
 * const { data, isLoading } = useDirectTeamMembers('2026-04');
 */
export const useDirectTeamMembers = (month?: string) => {
  return useQuery<ApiResponse<TeamMemberListItem[]>, AxiosError>({
    queryKey: ["pensionDirectTeamMembers", month],
    queryFn: () => getDirectTeamMembers(month),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Team Stats
 * Fetches team statistics only (no collection data)
 * 
 * @returns React Query result with team statistics
 * 
 * @example
 * const { data, isLoading } = useTeamStats();
 * const totalMembers = data?.data.total_members;
 */
export const useTeamStats = () => {
  return useQuery<ApiResponse<TeamStats>, AxiosError>({
    queryKey: ["pensionTeamStats"],
    queryFn: getTeamStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get Team Collections
 * Fetches monthly collection summary
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns React Query result with collection data
 * 
 * @example
 * const { data, isLoading } = useTeamCollections('2026-04');
 * const totalCollection = data?.data.total_collection;
 */
export const useTeamCollections = (month?: string) => {
  return useQuery<ApiResponse<TeamCollections>, AxiosError>({
    queryKey: ["pensionTeamCollections", month],
    queryFn: () => getTeamCollections(month),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Team Upline
 * Fetches your upline sponsors chain
 * 
 * @returns React Query result with upline members
 * 
 * @example
 * const { data, isLoading } = useTeamUpline();
 * const uplineChain = data?.data.data;
 */
export const useTeamUpline = () => {
  return useQuery<
    ApiResponse<{ data: UplineMember[]; total_levels: number }>,
    AxiosError
  >({
    queryKey: ["pensionTeamUpline"],
    queryFn: getTeamUpline,
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
  });
};

/**
 * Hook: Get Team Member Details
 * Fetches detailed information about a specific team member
 * 
 * @param userId - User ID
 * @returns React Query result with member details
 * 
 * @example
 * const { data, isLoading } = useTeamMemberDetails(25);
 * const memberInfo = data?.data;
 */
export const useTeamMemberDetails = (userId: number) => {
  return useQuery<ApiResponse<MemberDetails>, AxiosError>({
    queryKey: ["pensionTeamMemberDetails", userId],
    queryFn: () => getTeamMemberDetails(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get My Commissions
 * Fetches all commissions for the current user (paginated)
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns React Query result with commissions list
 * 
 * @example
 * const { data, isLoading } = useMyCommissions({ 
 *   type: 'installment_commission',
 *   status: 'credited',
 *   page: 1,
 *   per_page: 15
 * });
 */
export const useMyCommissions = (params?: import("@/lib/api/functions/user/pensionTeamApi").CommissionsParams) => {
  const { getMyCommissions } = require("@/lib/api/functions/user/pensionTeamApi");
  return useQuery<ApiResponse<import("@/lib/api/functions/user/pensionTeamApi").Commission[]>, AxiosError>({
    queryKey: ["myCommissions", params],
    queryFn: () => getMyCommissions(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get My Commission Stats
 * Fetches commission statistics for the current user
 * 
 * @param month - Optional month filter (YYYY-MM format)
 * @returns React Query result with commission statistics
 * 
 * @example
 * const { data, isLoading } = useMyCommissionStats('2026-04');
 * const totalCommissions = data?.data.summary.total_commissions;
 */
export const useMyCommissionStats = (month?: string) => {
  const { getMyCommissionStats } = require("@/lib/api/functions/user/pensionTeamApi");
  return useQuery<ApiResponse<import("@/lib/api/functions/user/pensionTeamApi").CommissionStats>, AxiosError>({
    queryKey: ["myCommissionStats", month],
    queryFn: () => getMyCommissionStats(month),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};
