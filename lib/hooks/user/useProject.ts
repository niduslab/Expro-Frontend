import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponseWithPagination, Project } from "@/lib/types/projectType";
import {
  getMyProjects,
  MyProjectsParams,
} from "@/lib/api/functions/user/myProjectsApi";

/**
 * Hook: Get My Projects
 * Fetches the authenticated user's projects with optional filters
 *
 * @param params - Optional query params (status, sort_by, sort_order, page, per_page)
 *
 * @example
 * // Default — active projects sorted by joining_date desc
 * const { data, isLoading } = useMyProjects();
 *
 * // Custom filters
 * const { data, isLoading } = useMyProjects({
 *   status: 'active',
 *   sort_by: 'joining_date',
 *   sort_order: 'desc',
 *   page: 1,
 *   per_page: 10,
 * });
 *
 * const projects = data?.data;       // Project[]
 * const pagination = data?.pagination;
 */
export const useMyProjects = (params?: MyProjectsParams) => {
  return useQuery<ApiResponseWithPagination<Project>, AxiosError>({
    queryKey: ["myprojects", params],
    queryFn: () => getMyProjects(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
