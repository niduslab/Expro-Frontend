// lib/api/functions/public/projects.ts

import {
  Project,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/projectType";
import { apiClient } from "@/lib/api/axios";

/**
 * Fetch projects with pagination
 */
export const fetchProjects = async (
  page = 1,
  per_page = 10,
): Promise<PaginatedResponse<Project>> => {
  const res = await apiClient.get<ApiResponseWithPagination<Project>>(
    `/public/projects?page=${page}&per_page=${per_page}`,
  );

  // Destructure correctly
  const { data, pagination } = res.data;

  return { data, pagination };
};

/**
 * Fetch a single project by ID
 */
export const fetchProjectById = async (id: number): Promise<Project> => {
  const res = await apiClient.get<{
    success: boolean;
    message: string;
    data: Project;
  }>(`/public/project/${id}`);

  return res.data.data;
};
