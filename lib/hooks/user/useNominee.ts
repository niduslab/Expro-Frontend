import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NomineeResponse } from "@/lib/types/admin/nomineeType";
import { getMyNominees } from "@/lib/api/functions/user/myNomineeApi";
/**
 * Hook: Get My Nominees
 * Fetches all nominees for the authenticated user
 *
 * @example
 * const { data, isLoading, error } = useMyNominees();
 * const nominees = data?.nominee;
 */
export const useMyNominees = () => {
  return useQuery<NomineeResponse, AxiosError>({
    queryKey: ["my-nominees"],
    queryFn: getMyNominees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
