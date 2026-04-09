import { apiRequest } from "@/lib/api/axios";
import { NomineeResponse } from "@/lib/types/admin/nomineeType";

/**
 * Get the authenticated user's nominees
 *
 * GET /mynominees
 */
export const getMyNominees = async (): Promise<NomineeResponse> => {
  const response = await apiRequest.get<NomineeResponse>("/mynominees");
  return response.data.data;
};
