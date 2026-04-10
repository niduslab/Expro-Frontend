import {
  MyProjectsParams,
  MyProjectsResponse,
} from "@/lib/types/projectMemberType";
import { apiRequest } from "../../axios";

/**
 * Fetch the authenticated user's project memberships.
 *
 * GET /api/v1/myprojects
 *
 * Supports filtering by project_id, project_role, status,
 * joining_date, expiry_date, and pagination.
 */
export const fetchMyProjects = async (
  params?: MyProjectsParams,
): Promise<MyProjectsResponse> => {
  const response = await apiRequest.get<MyProjectsResponse["data"]>(
    "/myprojects",
    { params },
  );

  // The generic wrapper returns { success, message, data }
  // but our endpoint also returns pagination at the top level,
  // so we surface the full response data here.
  return response.data as unknown as MyProjectsResponse;
};
