import { apiClient } from "@/lib/api/axios";
import {
  BlogCategoryListResponse,
  SingleBlogCategoryResponse,
  BlogCategoryPayload,
  DeleteBlogCategoryResponse,
} from "@/lib/types/admin/blogType";

/**
 * Get all blog categories (with optional query params for filtering/search/pagination)
 */
export const fetchBlogCategories = async (
  params?: Record<string, unknown>,
): Promise<BlogCategoryListResponse> => {
  const { data } = await apiClient.get("/blogcategories", { params });
  return data;
};

/**
 * Get single blog category by ID
 */
export const fetchBlogCategoryById = async (
  id: number | string,
): Promise<SingleBlogCategoryResponse> => {
  const { data } = await apiClient.get(`/blogcategory/${id}`);
  return data;
};

/**
 * Create a new blog category
 */
export const createBlogCategory = async (
  payload: BlogCategoryPayload,
): Promise<SingleBlogCategoryResponse> => {
  const { data } = await apiClient.post("/blogcategory", payload);
  return data;
};

/**
 * Update an existing blog category
 */
export const updateBlogCategory = async (
  id: number | string,
  payload: BlogCategoryPayload,
): Promise<SingleBlogCategoryResponse> => {
  const { data } = await apiClient.put(`/blogcategory/${id}`, payload);
  return data;
};

/**
 * Delete a blog category by ID
 */
export const deleteBlogCategory = async (
  id: number | string,
): Promise<DeleteBlogCategoryResponse> => {
  const { data } = await apiClient.delete(`/blogcategory/${id}`);
  return data;
};
