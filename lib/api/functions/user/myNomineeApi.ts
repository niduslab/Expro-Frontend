import { apiRequest } from "@/lib/api/axios";
import { NomineeResponse } from "@/lib/types/admin/nomineeType";

/**
 * Get the authenticated user's nominees
 *
 * GET /mynominees
 */
export const getMyNominees = async () => {
  const response = await apiRequest.get("/mynominees");
  return response.data; // { success, message, data: [...], pagination }
};
