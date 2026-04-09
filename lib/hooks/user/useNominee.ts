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
  return useQuery({
    queryKey: ["mynominees"],
    queryFn: async () => {
      const res = await getMyNominees();
      // Normalize so UI can use res.nominee
      return { ...res, nominee: res.data };
    },
    staleTime: 1000 * 60 * 5,
  });
};
