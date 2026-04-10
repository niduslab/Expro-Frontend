import { apiRequest, ApiResponse } from "@/lib/api/axios";
import { PensionInstallment } from "@/lib/types/admin/pensionsType";

/**
 * Get the authenticated user's pension installments
 *
 * GET /mypensioninstallments
 */
export const getMyPensionInstallments = async (): Promise<
  ApiResponse<PensionInstallment[]>
> => {
  const response = await apiRequest.get<PensionInstallment[]>(
    "/mypensioninstallments",
  );
  return response.data;
};
