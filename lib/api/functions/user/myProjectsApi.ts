import { apiRequest } from "@/lib/api/axios";
import { ApiResponseWithPagination, Project } from "@/lib/types/projectType";

export interface MyProjectsParams {
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

/**
 * Get the authenticated user's projects
 *
 * GET /myprojects?status=active&sort_by=joining_date&sort_order=desc
 */
export const getMyProjects = async (
  params?: MyProjectsParams,
): Promise<ApiResponseWithPagination<Project>> => {
  const response = await apiRequest.get<Project[]>("/myprojects", { params });
  return response.data as unknown as ApiResponseWithPagination<Project>;
};
