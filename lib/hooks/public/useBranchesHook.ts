import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchBranches,
  fetchBranchById,
} from "@/lib/api/functions/public/branchesApi";
import {
  Branch,
  BranchListResponse,
  SingleBranchResponse,
} from "@/lib/types/branchType";

/**
 * Get all branches
 */
export const useBranches = (
  options?: UseQueryOptions<BranchListResponse, Error>,
) => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    ...options,
  });
};

/**
 * Get single branch
 */
export const useBranch = (
  id: number | string,
  options?: UseQueryOptions<SingleBranchResponse, Error>,
) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () => fetchBranchById(id),
    enabled: !!id, // prevent empty calls
    ...options,
  });
};
