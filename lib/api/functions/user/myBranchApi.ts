import { apiRequest, ApiResponse } from "@/lib/api/axios";
import { Branch } from "@/lib/types/branchType";

/**
 * Get the authenticated user's branch
 *
 * GET /mybranch
 */
export const getMyBranch = async (): Promise<ApiResponse<Branch>> => {
  const response = await apiRequest.get<Branch>("/mybranch");
  return response.data;
};
