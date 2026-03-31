import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  MutationFunctionContext,
} from "@tanstack/react-query";
import {
  fetchBranches,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/lib/api/functions/admin/branchesApi";
import {
  BranchListResponse,
  SingleBranchResponse,
  BranchPayload,
  DeleteBranchResponse,
} from "@/lib/types/branchType";

// ─── Query Keys ────────────────────────────────────────────────
export const branchKeys = {
  all: ["branches"] as const,
  detail: (id: number | string) => ["branch", id] as const,
};

// ─── Queries ────────────────────────────────────────────────────

export const useBranches = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<BranchListResponse, Error>,
) => {
  return useQuery({
    queryKey: [...branchKeys.all, params],
    queryFn: () => fetchBranches(params),
    ...options,
  });
};

export const useBranch = (
  id: number | string,
  options?: UseQueryOptions<SingleBranchResponse, Error>,
) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => fetchBranchById(id),
    enabled: !!id,
    ...options,
  });
};

// ─── Mutations ──────────────────────────────────────────────────

type CreateBranchOptions = UseMutationOptions<
  SingleBranchResponse,
  Error,
  BranchPayload,
  void
>;

export const useCreateBranch = (options?: CreateBranchOptions) => {
  const queryClient = useQueryClient();

  return useMutation<SingleBranchResponse, Error, BranchPayload, void>({
    mutationFn: (payload) => createBranch(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type UpdateBranchOptions = UseMutationOptions<
  SingleBranchResponse,
  Error,
  BranchPayload,
  void
>;

export const useUpdateBranch = (
  id: number | string,
  options?: UpdateBranchOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<SingleBranchResponse, Error, BranchPayload, void>({
    mutationFn: (payload) => updateBranch(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      queryClient.invalidateQueries({ queryKey: branchKeys.detail(id) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type DeleteBranchOptions = UseMutationOptions<
  DeleteBranchResponse,
  Error,
  number | string,
  void
>;

export const useDeleteBranch = (options?: DeleteBranchOptions) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteBranchResponse, Error, number | string, void>({
    mutationFn: (id) => deleteBranch(id),
    ...options,
    onSuccess: (data, id, onMutateResult, context) => {
      queryClient.removeQueries({ queryKey: branchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      options?.onSuccess?.(data, id, onMutateResult, context);
    },
  });
};
