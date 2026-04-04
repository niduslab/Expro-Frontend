import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  fetchBlogCategories,
  fetchBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "@/lib/api/functions/admin/blogCategoriesApi";
import {
  BlogCategoryListResponse,
  SingleBlogCategoryResponse,
  BlogCategoryPayload,
  DeleteBlogCategoryResponse,
} from "@/lib/types/admin/blogType";

// ─── Query Keys ────────────────────────────────────────────────
export const blogCategoryKeys = {
  all: ["blogCategories"] as const,
  detail: (id: number | string) => ["blogCategory", id] as const,
};

// ─── Queries ────────────────────────────────────────────────────

export const useBlogCategories = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<BlogCategoryListResponse, Error>,
) => {
  return useQuery({
    queryKey: [...blogCategoryKeys.all, params],
    queryFn: () => fetchBlogCategories(params),
    ...options,
  });
};

export const useBlogCategory = (
  id: number | string,
  options?: UseQueryOptions<SingleBlogCategoryResponse, Error>,
) => {
  return useQuery({
    queryKey: blogCategoryKeys.detail(id),
    queryFn: () => fetchBlogCategoryById(id),
    enabled: !!id,
    ...options,
  });
};

// ─── Mutations ──────────────────────────────────────────────────

type CreateBlogCategoryOptions = UseMutationOptions<
  SingleBlogCategoryResponse,
  Error,
  BlogCategoryPayload,
  void
>;

export const useCreateBlogCategory = (options?: CreateBlogCategoryOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleBlogCategoryResponse,
    Error,
    BlogCategoryPayload,
    void
  >({
    mutationFn: (payload) => createBlogCategory(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type UpdateBlogCategoryOptions = UseMutationOptions<
  SingleBlogCategoryResponse,
  Error,
  BlogCategoryPayload,
  void
>;

export const useUpdateBlogCategory = (
  id: number | string,
  options?: UpdateBlogCategoryOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleBlogCategoryResponse,
    Error,
    BlogCategoryPayload,
    void
  >({
    mutationFn: (payload) => updateBlogCategory(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.detail(id) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type DeleteBlogCategoryOptions = UseMutationOptions<
  DeleteBlogCategoryResponse,
  Error,
  number | string,
  void
>;

export const useDeleteBlogCategory = (options?: DeleteBlogCategoryOptions) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteBlogCategoryResponse, Error, number | string, void>({
    mutationFn: (id) => deleteBlogCategory(id),
    ...options,
    onSuccess: (data, id, onMutateResult, context) => {
      queryClient.removeQueries({ queryKey: blogCategoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: blogCategoryKeys.all });
      options?.onSuccess?.(data, id, onMutateResult, context);
    },
  });
};
