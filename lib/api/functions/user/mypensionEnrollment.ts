import { apiRequest, ApiResponse } from "@/lib/api/axios";
import { PensionEnrollment } from "@/lib/types/admin/pensionsType";

/**
 * Get the authenticated user's pension enrollments
 *
 * GET /mypensionenrollments
 */
export const getMyPensionEnrollments = async (): Promise<
  ApiResponse<PensionEnrollment[]>
> => {
  const response = await apiRequest.get<PensionEnrollment[]>(
    "/mypensionenrollments",
  );
  return response.data;
};
