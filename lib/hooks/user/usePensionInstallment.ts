import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/lib/api/axios";
import { PensionInstallment } from "@/lib/types/admin/pensionsType";
import { getMyPensionInstallments } from "@/lib/api/functions/user/mypensionInstallment";

/**
 * Hook: Get My Pension Installments
 * Fetches all pension installments for the authenticated user
 *
 * @example
 * const { data, isLoading, error } = useMyPensionInstallments();
 * const installments = data?.data;
 */
export const useMyPensionInstallments = () => {
  return useQuery<ApiResponse<PensionInstallment[]>, AxiosError>({
    queryKey: ["mypensioninstallments"],
    queryFn: getMyPensionInstallments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
