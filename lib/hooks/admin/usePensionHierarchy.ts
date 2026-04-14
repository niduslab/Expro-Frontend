import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/lib/api/axios";
import {
  getPackageHierarchy,
  getUserHierarchy,
  getPensionHierarchyOverview,
  PackageHierarchyData,
  UserHierarchyData,
  PackageOverviewItem,
} from "@/lib/api/functions/admin/pensionHierarchyApi";

/**
 * Hook: Get Package Hierarchy
 * Fetches complete hierarchy for a pension package (Admin only)
 * 
 * @param packageId - Pension package ID
 * @param month - Optional month filter (YYYY-MM format)
 * @returns React Query result with package hierarchy data
 * 
 * @example
 * const { data, isLoading } = usePackageHierarchy(1, '2026-04');
 * const hierarchies = data?.data.hierarchies;
 * const totals = data?.data.totals;
 */
export const usePackageHierarchy = (packageId: number, month?: string) => {
  return useQuery<ApiResponse<PackageHierarchyData>, AxiosError>({
    queryKey: ["adminPackageHierarchy", packageId, month],
    queryFn: () => getPackageHierarchy(packageId, month),
    enabled: !!packageId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get User Hierarchy
 * Fetches complete hierarchy for a specific user (Admin only)
 * 
 * @param userId - User ID
 * @param month - Optional month filter (YYYY-MM format)
 * @returns React Query result with user hierarchy data
 * 
 * @example
 * const { data, isLoading } = useUserHierarchy(25, '2026-04');
 * const userInfo = data?.data.user;
 * const downlineTree = data?.data.downline_tree;
 */
export const useUserHierarchy = (userId: number, month?: string) => {
  return useQuery<ApiResponse<UserHierarchyData>, AxiosError>({
    queryKey: ["adminUserHierarchy", userId, month],
    queryFn: () => getUserHierarchy(userId, month),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get Pension Hierarchy Overview
 * Fetches overview of all pension packages (Admin only)
 * 
 * @returns React Query result with packages overview
 * 
 * @example
 * const { data, isLoading } = usePensionHierarchyOverview();
 * const packages = data?.data;
 */
export const usePensionHierarchyOverview = () => {
  return useQuery<ApiResponse<PackageOverviewItem[]>, AxiosError>({
    queryKey: ["adminPensionHierarchyOverview"],
    queryFn: getPensionHierarchyOverview,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};