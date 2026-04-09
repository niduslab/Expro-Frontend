import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/lib/api/axios";
import { Branch } from "@/lib/types/branchType";
import { getMyBranch } from "@/lib/api/functions/user/myBranchApi";

/**
 * Hook: Get My Branch
 * Fetches the branch assigned to the authenticated user
 *
 * @example
 * const { data, isLoading, error } = useMyBranch();
 * const branch = data?.data;
 */
export const useMyBranch = () => {
  return useQuery<ApiResponse<Branch>, AxiosError>({
    queryKey: ["my-branch"],
    queryFn: getMyBranch,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
