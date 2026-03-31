import { apiClient } from "@/lib/api/axios";
import {
  BranchListResponse,
  SingleBranchResponse,
  BranchPayload,
  DeleteBranchResponse,
} from "@/lib/types/branchType";

/**
 * Get all branches (with optional query params for filtering/search/pagination)
 */
export const fetchBranches = async (
  params?: Record<string, unknown>,
): Promise<BranchListResponse> => {
  const { data } = await apiClient.get("/branches", { params });
  return data;
};

/**
 * Get single branch by ID
 */
export const fetchBranchById = async (
  id: number | string,
): Promise<SingleBranchResponse> => {
  const { data } = await apiClient.get(`/branch/${id}`);
  return data;
};

/**
 * Create a new branch
 */
export const createBranch = async (
  payload: BranchPayload,
): Promise<SingleBranchResponse> => {
  const { data } = await apiClient.post("/branch", payload);
  return data;
};

/**
 * Update an existing branch
 */
export const updateBranch = async (
  id: number | string,
  payload: BranchPayload,
): Promise<SingleBranchResponse> => {
  const { data } = await apiClient.put(`/branch/${id}`, payload);
  return data;
};

/**
 * Delete a branch by ID
 */
export const deleteBranch = async (
  id: number | string,
): Promise<DeleteBranchResponse> => {
  const { data } = await apiClient.delete(`/branch/${id}`);
  return data;
};
