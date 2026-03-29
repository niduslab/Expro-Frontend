import { apiClient } from "@/lib/api/axios";
import {
  BranchListResponse,
  SingleBranchResponse,
} from "@/lib/types/branchType";

/**
 * Get all branches
 */
export const fetchBranches = async (): Promise<BranchListResponse> => {
  const { data } = await apiClient.get("/public/branches");
  return data;
};

/**
 * Get single branch by ID
 */
export const fetchBranchById = async (
  id: number | string,
): Promise<SingleBranchResponse> => {
  const { data } = await apiClient.get(`/public/branch/${id}`);
  return data;
};
