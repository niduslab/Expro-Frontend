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
  });
