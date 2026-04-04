// lib/hooks/public/blogHooks.ts

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { BlogPost, PaginatedResponse } from "@/lib/types/blogsType";
import {
  fetchBlogs,
  fetchBlogBySlug,
} from "@/lib/api/functions/public/blogsApi";

/**
 * Get paginated blogs
 */
export const useBlogs = (page: number, per_page: number = 10) => {
  const options: UseQueryOptions<
    PaginatedResponse<BlogPost>,
    Error,
    PaginatedResponse<BlogPost>,
    [string, number, number]
  > = {
    queryKey: ["blogs", page, per_page],
    queryFn: () => fetchBlogs(page, per_page),
    placeholderData: (prev) => prev,
    retry: (failureCount, error: any) => {
      // Retry up to 3 times for rate limit errors
      if (error?.response?.status === 429 && failureCount < 3) {
        return true;
      }
      // Don't retry for other errors
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  };

  return useQuery(options);
};

/**
 * Get single blog
 */
export const useBlog = (slug: string) =>
  useQuery<BlogPost, Error>({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: !!slug,
    retry: (failureCount, error: any) => {
      // Retry up to 3 times for rate limit errors
      if (error?.response?.status === 429 && failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
