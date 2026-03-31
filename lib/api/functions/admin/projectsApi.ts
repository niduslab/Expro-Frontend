import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ApiResponse,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/projectType";
import { apiClient } from "@/lib/api/axios";

export const getProjects = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
}): Promise<PaginatedResponse<Project>> => {
  const res = await apiClient.get<ApiResponseWithPagination<Project>>(
    "/projects",
    { params },
  );
  return {
    data: res.data.data,
    pagination: res.data.pagination,
  };
};

export const getProjectById = async (id: number): Promise<Project> => {
  const res = await apiClient.get<ApiResponse<Project>>(`/project/${id}`);
  return res.data.data;
};

export const createProject = async (
  payload: CreateProjectPayload,
): Promise<Project> => {
  const res = await apiClient.post<ApiResponse<Project>>("/project", payload);
  return res.data.data;
};

export const updateProject = async (
  id: number,
  payload: UpdateProjectPayload,
): Promise<Project> => {
  const res = await apiClient.put<ApiResponse<Project>>(
    `/project/${id}`,
    payload,
  );
  return res.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/project/${id}`);
};
