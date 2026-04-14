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
  q?: string;
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

// Keys that are handled manually and must be skipped in the generic loop
const MANUAL_KEYS = new Set([
  "featured_image",
  "gallery",
  "gallery_keep",
  "is_featured",
  "is_published",
]);

export const createProject = async (
  payload: CreateProjectPayload,
): Promise<Project> => {
  const form = new FormData();

  // Generic scalar fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (MANUAL_KEYS.has(key)) return; // handled below
    form.append(key, String(value));
  });

  // Booleans → "1" / "0" for Laravel
  form.append("is_featured", payload.is_featured ? "1" : "0");
  form.append("is_published", payload.is_published ? "1" : "0");

  // Single featured image
  if (payload.featured_image) {
    form.append("featured_image", payload.featured_image);
  }

  // Gallery: multiple new files
  payload.gallery?.forEach((file) => {
    form.append("gallery[]", file);
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

  // Generic scalar fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (MANUAL_KEYS.has(key)) return; // handled below
    form.append(key, String(value));
  });

  // Booleans → "1" / "0" for Laravel
  if (payload.is_featured !== undefined) {
    form.append("is_featured", payload.is_featured ? "1" : "0");
  }
  if (payload.is_published !== undefined) {
    form.append("is_published", payload.is_published ? "1" : "0");
  }

  // Single featured image
  if (payload.featured_image) {
    form.append("featured_image", payload.featured_image);
  }

  // New gallery files to upload
  payload.gallery?.forEach((file) => {
    form.append("gallery[]", file);
  });

  // Existing gallery URLs the user chose to keep — backend uses this to
  // delete any URLs that were removed in the UI
  (payload.gallery_keep ?? []).forEach((url) => {
    form.append("gallery_keep[]", url);
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
