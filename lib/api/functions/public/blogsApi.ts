// lib/api/functions/public/blogs.ts

import {
  BlogPost,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/blogsType";
import { apiClient } from "@/lib/api/axios";

/**
 * Fetch blog posts
 */
export const fetchBlogs = async (
  page = 1,
  per_page = 10,
): Promise<PaginatedResponse<BlogPost>> => {
  const res = await apiClient.get<ApiResponseWithPagination<BlogPost>>(
    `/public/blogposts?page=${page}&per_page=${per_page}`,
  );

  const { data, pagination } = res.data;

  return { data, pagination };
};

/**
 * Fetch single blog (by slug)
 */
export const fetchBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const res = await apiClient.get<{
    success: boolean;
    message: string;
    data: BlogPost;
  }>(`/public/blogpost/${slug}`);

  return res.data.data;
};
