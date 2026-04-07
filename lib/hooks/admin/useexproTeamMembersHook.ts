import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  fetchExproTeamMembers,
  fetchExproTeamMemberById,
  createExproTeamMember,
  updateExproTeamMember,
  deleteExproTeamMember,
} from "@/lib/api/functions/admin/exproTeamMembersApi";
import {
  ExproTeamMemberListResponse,
  SingleExproTeamMemberResponse,
  DeleteExproTeamMemberResponse,
} from "@/lib/types/admin/exproTeamMemberType";

// ─── Query Keys ─────────────────────────────────────────────────
export const exproTeamMemberKeys = {
  all: ["exproteammembers"] as const,
  detail: (id: number | string) => ["exproteammember", id] as const,
};

// ─── Queries ─────────────────────────────────────────────────────

export const useExproTeamMembers = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<ExproTeamMemberListResponse, Error>,
) => {
  return useQuery({
    queryKey: [...exproTeamMemberKeys.all, params],
    queryFn: () => fetchExproTeamMembers(params),
    ...options,
  });
};

export const useExproTeamMember = (
  id: number | string,
  options?: UseQueryOptions<SingleExproTeamMemberResponse, Error>,
) => {
  return useQuery({
    queryKey: exproTeamMemberKeys.detail(id),
    queryFn: () => fetchExproTeamMemberById(id),
    enabled: !!id,
    ...options,
  });
};

// ─── Mutations ───────────────────────────────────────────────────

type CreateOptions = UseMutationOptions<
  SingleExproTeamMemberResponse,
  Error,
  FormData,
  void
>;

export const useCreateExproTeamMember = (options?: CreateOptions) => {
  const queryClient = useQueryClient();

  return useMutation<SingleExproTeamMemberResponse, Error, FormData, void>({
    mutationFn: (payload) => createExproTeamMember(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: exproTeamMemberKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type UpdateOptions = UseMutationOptions<
  SingleExproTeamMemberResponse,
  Error,
  FormData,
  void
>;

export const useUpdateExproTeamMember = (
  id: number | string,
  options?: UpdateOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<SingleExproTeamMemberResponse, Error, FormData, void>({
    mutationFn: (payload) => updateExproTeamMember(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: exproTeamMemberKeys.all });
      queryClient.invalidateQueries({
        queryKey: exproTeamMemberKeys.detail(id),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type DeleteOptions = UseMutationOptions<
  DeleteExproTeamMemberResponse,
  Error,
  number | string,
  void
>;

export const useDeleteExproTeamMember = (options?: DeleteOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteExproTeamMemberResponse,
    Error,
    number | string,
    void
  >({
    mutationFn: (id) => deleteExproTeamMember(id),
    ...options,
    onSuccess: (data, id, onMutateResult, context) => {
      queryClient.removeQueries({ queryKey: exproTeamMemberKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: exproTeamMemberKeys.all });
      options?.onSuccess?.(data, id, onMutateResult, context);
    },
  });
};
