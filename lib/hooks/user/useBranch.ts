import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/lib/api/axios";
import { Branch } from "@/lib/types/branchType";
import { getMyBranch } from "@/lib/api/functions/user/myBranchApi";

export const useMyBranch = () => {
  return useQuery<ApiResponse<Branch> | null, AxiosError>({
    queryKey: ["mybranch"],
    queryFn: async () => {
      try {
        return await getMyBranch();
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        // 404 means no branch assigned — not a real error
        if (axiosError.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
