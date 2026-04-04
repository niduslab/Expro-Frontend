import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  fetchBlogPosts,
  fetchBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/api/functions/admin/blogPostsApi";
import {
  BlogPostListResponse,
  SingleBlogPostResponse,
  BlogPostPayload,
  DeleteBlogPostResponse,
} from "@/lib/types/admin/blogType";

// ─── Query Keys ────────────────────────────────────────────────
export const blogPostKeys = {
  all: ["blogPosts"] as const,
  detail: (id: number | string) => ["blogPost", id] as const,
};

// ─── Queries ────────────────────────────────────────────────────

export const useBlogPosts = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<BlogPostListResponse, Error>,
) => {
  return useQuery({
    queryKey: [...blogPostKeys.all, params],
    queryFn: () => fetchBlogPosts(params),
    ...options,
  });
};

export const useBlogPost = (
  id: number | string,
  options?: UseQueryOptions<SingleBlogPostResponse, Error>,
) => {
  return useQuery({
    queryKey: blogPostKeys.detail(id),
    queryFn: () => fetchBlogPostById(id),
    enabled: !!id,
    ...options,
  });
};

// ─── Mutations ──────────────────────────────────────────────────

type CreateBlogPostOptions = UseMutationOptions<
  SingleBlogPostResponse,
  Error,
  BlogPostPayload,
  void
>;

export const useCreateBlogPost = (options?: CreateBlogPostOptions) => {
  const queryClient = useQueryClient();

  return useMutation<SingleBlogPostResponse, Error, BlogPostPayload, void>({
    mutationFn: (payload) => createBlogPost(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type UpdateBlogPostOptions = UseMutationOptions<
  SingleBlogPostResponse,
  Error,
  BlogPostPayload,
  void
>;

export const useUpdateBlogPost = (
  id: number | string,
  options?: UpdateBlogPostOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<SingleBlogPostResponse, Error, BlogPostPayload, void>({
    mutationFn: (payload) => updateBlogPost(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.all });
      queryClient.invalidateQueries({ queryKey: blogPostKeys.detail(id) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type DeleteBlogPostOptions = UseMutationOptions<
  DeleteBlogPostResponse,
  Error,
  number | string,
  void
>;

export const useDeleteBlogPost = (options?: DeleteBlogPostOptions) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteBlogPostResponse, Error, number | string, void>({
    mutationFn: (id) => deleteBlogPost(id),
    ...options,
    onSuccess: (data, id, onMutateResult, context) => {
      queryClient.removeQueries({ queryKey: blogPostKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: blogPostKeys.all });
      options?.onSuccess?.(data, id, onMutateResult, context);
    },
  });
};
