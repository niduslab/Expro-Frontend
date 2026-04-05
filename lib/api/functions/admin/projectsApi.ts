import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ApiResponse,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/projectType";
import { apiClient } from "@/lib/api/axios";

// In projectsApi.ts — update the params type
export const getProjects = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
  q?: string; // ← add this
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
  const form = new FormData();

  // Append all fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "featured_image") {
      form.append("featured_image", value as File);
    } else if (key === "is_featured" || key === "is_published") {
      // Convert boolean to "1" / "0" for Laravel
      form.append(key, value ? "1" : "0");
    } else {
      form.append(key, String(value));
    }
  });

  const res = await apiClient.post<ApiResponse<Project>>("/project", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateProject = async (
  id: number,
  payload: UpdateProjectPayload,
): Promise<Project> => {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "featured_image") {
      form.append("featured_image", value as File);
    } else if (key === "is_featured" || key === "is_published") {
      // Convert boolean to "1" / "0" for Laravel
      form.append(key, value ? "1" : "0");
    } else {
      form.append(key, String(value));
    }
  });

  // Laravel PUT doesn't support FormData — use POST + method spoofing
  form.append("_method", "PUT");

  const res = await apiClient.post<ApiResponse<Project>>(
    `/project/${id}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/project/${id}`);
};
