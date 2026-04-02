import { apiClient } from "@/lib/api/axios";
import {
  BlogPostListResponse,
  SingleBlogPostResponse,
  BlogPostPayload,
  DeleteBlogPostResponse,
} from "@/lib/types/admin/blogType";

/**
 * Get all blog posts (with optional query params for filtering/search/pagination)
 */
export const fetchBlogPosts = async (
  params?: Record<string, unknown>,
): Promise<BlogPostListResponse> => {
  const { data } = await apiClient.get("/blogposts", { params });
  return data;
};

/**
 * Get single blog post by ID
 */
export const fetchBlogPostById = async (
  id: number | string,
): Promise<SingleBlogPostResponse> => {
  const { data } = await apiClient.get(`/blogpost/${id}`);
  return data;
};

/**
 * Create a new blog post
 */
export const createBlogPost = async (
  payload: BlogPostPayload,
): Promise<SingleBlogPostResponse> => {
  const { data } = await apiClient.post("/blogposts", payload);
  return data;
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  id: number | string,
  payload: BlogPostPayload,
): Promise<SingleBlogPostResponse> => {
  const { data } = await apiClient.put(`/blogpost/${id}`, payload);
  return data;
};

/**
 * Delete a blog post by ID
 */
export const deleteBlogPost = async (
  id: number | string,
): Promise<DeleteBlogPostResponse> => {
  const { data } = await apiClient.delete(`/blogpost/${id}`);
  return data;
};
