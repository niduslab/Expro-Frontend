import { apiRequest, ApiResponse } from "@/lib/api/axios";

/**
 * Admin Pension Hierarchy Types
 */

export interface PackageHierarchyRoot {
  root_user_id: number;
  root_member_id: string;
  root_name: string;
  tree: any[]; // Will contain nested hierarchy structure
}

export interface PackageHierarchyData {
  package: {
    id: number;
    name: string;
    monthly_amount: number;
  };
  hierarchies: PackageHierarchyRoot[];
  totals: {
    total_members: number;
    total_collection: number;
    total_hierarchies: number;
  };
  period: string;
}

export interface UserHierarchyData {
  user: {
    id: number;
    member_id: string;
    name_english: string;
  };
  enrollments: any[];
  upline: any[];
  downline_tree: any[];
  stats: any;
  totals: any;
  period: string;
}

export interface PackageOverviewItem {
  package_id: number;
  package_name: string;
  total_enrollments: number;
  by_role: Record<string, number>;
  by_status: Record<string, number>;
}

/**
 * Get complete hierarchy for a pension package
 * 
 * GET /admin/pension-package/{packageId}/hierarchy
 * 
 * @param packageId - Pension package ID
 * @param month - Optional month filter (YYYY-MM format)
 * @returns Package hierarchy data
 */
export const getPackageHierarchy = async (
  packageId: number,
  month?: string
): Promise<ApiResponse<PackageHierarchyData>> => {
  const response = await apiRequest.get<PackageHierarchyData>(
    `/admin/pension-package/${packageId}/hierarchy`,
    { params: { month } }
  );
  return response.data;
};

/**
 * Get complete hierarchy for a specific user
 * 
 * GET /admin/user/{userId}/hierarchy
 * 
 * @param userId - User ID
 * @param month - Optional month filter (YYYY-MM format)
 * @returns User hierarchy data
 */
export const getUserHierarchy = async (
  userId: number,
  month?: string
): Promise<ApiResponse<UserHierarchyData>> => {
  const response = await apiRequest.get<UserHierarchyData>(
    `/admin/user/${userId}/hierarchy`,
    { params: { month } }
  );
  return response.data;
};

/**
 * Get overview of all pension packages
 * 
 * GET /admin/pension-hierarchy/overview
 * 
 * @returns Overview of all pension packages
 */
export const getPensionHierarchyOverview = async (): Promise<
  ApiResponse<PackageOverviewItem[]>
> => {
  const response = await apiRequest.get<PackageOverviewItem[]>(
    "/admin/pension-hierarchy/overview"
  );
  return response.data;
};