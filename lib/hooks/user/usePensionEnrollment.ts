import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/lib/api/axios";
import { PensionEnrollment } from "@/lib/types/admin/pensionsType";
import { getMyPensionEnrollments } from "@/lib/api/functions/user/mypensionEnrollment";

/**
 * Hook: Get My Pension Enrollments
 * Fetches all pension enrollments for the authenticated user
 *
 * @example
 * const { data, isLoading, error } = useMyPensionEnrollments();
 * const enrollments = data?.data;
 */
export const useMyPensionEnrollments = () => {
  return useQuery<ApiResponse<PensionEnrollment[]>, AxiosError>({
    queryKey: ["mypensionenrollments"],
    queryFn: getMyPensionEnrollments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
