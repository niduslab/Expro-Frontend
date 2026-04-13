import type {
  ProjectMember,
  CreateProjectMemberPayload,
  UpdateProjectMemberPayload,
  ProjectMemberFilters,
  MyProjectsFilters,
} from "@/lib/types/admin/projectMemberType";
import { apiRequest, ApiResponse, PaginatedResponse } from "../../axios";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strip undefined/null values so they don't pollute query strings.
 */
function toParams(
  filters: Record<string, unknown>,
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  ) as Record<string, string | number>;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/**
 * GET /projectmembers
 * Returns a paginated list of all project members (admin view).
 */
export const getProjectMembers = async (
  filters: ProjectMemberFilters = {},
): Promise<PaginatedResponse<ProjectMember>> => {
  const { data } = await apiRequest.get<never>("/projectmembers", {
    params: toParams(filters as Record<string, unknown>),
  });
  return data as unknown as PaginatedResponse<ProjectMember>;
};

/**
 * GET /projectmember/:id
 * Returns a single project member with project, user, and parent relations.
 */
export const getProjectMemberById = async (
  id: number,
): Promise<ApiResponse<ProjectMember>> => {
  const { data } = await apiRequest.get<ProjectMember>(`/projectmember/${id}`);
  return data;
};

/**
 * POST /projectmember
 * Create (assign) a new project member.
 */
export const createProjectMember = async (
  payload: CreateProjectMemberPayload,
): Promise<ApiResponse<ProjectMember>> => {
  const { data } = await apiRequest.post<ProjectMember>(
    "/projectmember",
    payload,
  );
  return data;
};

/**
 * PUT /projectmember/:id
 * Update an existing project member.
 */
export const updateProjectMember = async (
  id: number,
  payload: UpdateProjectMemberPayload,
): Promise<ApiResponse<ProjectMember>> => {
  const { data } = await apiRequest.put<ProjectMember>(
    `/projectmember/${id}`,
    payload,
  );
  return data;
};

/**
 * DELETE /projectmember/:id
 * Soft-delete a project member.
 */
export const deleteProjectMember = async (
  id: number,
): Promise<ApiResponse<null>> => {
  const { data } = await apiRequest.delete<null>(`/projectmember/${id}`);
  return data;
};

/**
 * GET /myprojects
 * Returns the authenticated user's project memberships.
 */
export const getMyProjects = async (
  filters: MyProjectsFilters = {},
): Promise<PaginatedResponse<ProjectMember>> => {
  const { data } = await apiRequest.get<never>("/myprojects", {
    params: toParams(filters as Record<string, unknown>),
  });
  return data as unknown as PaginatedResponse<ProjectMember>;
};
