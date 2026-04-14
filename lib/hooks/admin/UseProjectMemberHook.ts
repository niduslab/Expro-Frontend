// hooks/useProjectMember.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  CreateProjectMemberPayload,
  UpdateProjectMemberPayload,
  ProjectMemberFilters,
  MyProjectsFilters,
} from "@/lib/types/admin/projectMemberType";
import {
  getProjectMembers,
  getProjectMemberById,
  createProjectMember,
  updateProjectMember,
  deleteProjectMember,
  getMyProjects,
} from "@/lib/api/functions/admin/projectMemberApi";
import { ApiError } from "@/lib/api/axios";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const projectMemberKeys = {
  all: ["projectMembers"] as const,

  // Paginated list with optional filters
  lists: () => [...projectMemberKeys.all, "list"] as const,
  list: (filters: ProjectMemberFilters) =>
    [...projectMemberKeys.lists(), filters] as const,

  // Single record
  details: () => [...projectMemberKeys.all, "detail"] as const,
  detail: (id: number) => [...projectMemberKeys.details(), id] as const,

  // Auth user's own memberships
  myProjects: (filters: MyProjectsFilters) =>
    [...projectMemberKeys.all, "myProjects", filters] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Paginated list of all project members.
 * Pass `filters.project_id` to scope to a specific project.
 *
 * Usage:
 *   const { data } = useProjectMembers({ project_id: 6 });
 *   data.data        → ProjectMember[]
 *   data.pagination  → { total, per_page, current_page, last_page }
 */
export const useProjectMembers = (filters: ProjectMemberFilters = {}) => {
  return useQuery({
    queryKey: projectMemberKeys.list(filters),
    queryFn: () => getProjectMembers(filters),
    placeholderData: keepPreviousData, // smooth pagination — keep old data while fetching next page
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Single project member by ID (includes project, user, parent relations).
 *
 * Usage:
 *   const { data } = useProjectMember(memberId);
 *   data.data  → ProjectMember
 */
export const useProjectMember = (id: number | null | undefined) => {
  return useQuery({
    queryKey: projectMemberKeys.detail(id!),
    queryFn: () => getProjectMemberById(id!),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Authenticated user's own project memberships.
 *
 * Usage:
 *   const { data } = useMyProjects({ status: "active" });
 */
export const useMyProjects = (filters: MyProjectsFilters = {}) => {
  return useQuery({
    queryKey: projectMemberKeys.myProjects(filters),
    queryFn: () => getMyProjects(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Create (assign) a new project member.
 *
 * Usage:
 *   const { mutate, isPending } = useCreateProjectMember();
 *   mutate(payload, { onSuccess: () => ... });
 */
export const useCreateProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectMemberPayload) =>
      createProjectMember(payload),

    onSuccess: (data, variables) => {
      // Invalidate all list queries (catches any filter combination)
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.lists() });
      // Also invalidate the specific project's member list if we know the id
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list({ project_id: variables.project_id }),
      });
    },

    onError: (error: AxiosError<ApiError>) => {
      console.error(
        "Failed to create project member:",
        error.response?.data?.message,
      );
    },
  });
};

/**
 * Update an existing project member.
 *
 * Usage:
 *   const { mutate, isPending } = useUpdateProjectMember();
 *   mutate({ id: 3, payload });
 */
export const useUpdateProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateProjectMemberPayload;
    }) => updateProjectMember(id, payload),

    onSuccess: (data, variables) => {
      // Update the cached single record immediately
      queryClient.setQueryData(projectMemberKeys.detail(variables.id), data);
      // Refresh all list queries so table reflects new values
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.lists() });
    },

    onError: (error: AxiosError<ApiError>) => {
      console.error(
        "Failed to update project member:",
        error.response?.data?.message,
      );
    },
  });
};

/**
 * Delete (soft-delete) a project member.
 *
 * Usage:
 *   const { mutate, isPending } = useDeleteProjectMember();
 *   mutate(memberId);
 */
export const useDeleteProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProjectMember(id),

    onSuccess: (_, id) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: projectMemberKeys.detail(id) });
      // Refresh all list queries
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.lists() });
    },

    onError: (error: AxiosError<ApiError>) => {
      console.error(
        "Failed to delete project member:",
        error.response?.data?.message,
      );
    },
  });
};
