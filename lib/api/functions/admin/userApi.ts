import {
  UserListItem,
  UsersResponse,
  SystemUsersResponse,
  CreateSystemUserRequest,
  CreateSystemUserResponse,
  UpdateSystemUserRequest,
  ChangeUserPasswordRequest,
} from "@/lib/types/admin/userType";
import {
  AssignRoleRequest,
  AssignRoleResponse,
  Role,
  RolesResponse,
  Permission,
  PermissionsResponse,
  CreatePermissionRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  MutationResponse,
} from "@/lib/types/admin/roleType";
import apiClient, { ApiResponse } from "../../axios";

export const fetchMyProfile = async (): Promise<UserListItem> => {
  const res = await apiClient.get<ApiResponse<UserListItem>>("/user", {
    withCredentials: true,
  });

  return res.data?.data ?? null;
};

export const fetchAllusers = async (
  page: number = 1,
): Promise<UsersResponse> => {
  const res = await apiClient.get<UsersResponse>(
    `/admin/members?page=${page}`,
    {
      withCredentials: true,
    },
  );

  return res.data;
};

export const fetchMemberDashboard = async () => {
  const res = await apiClient.get<ApiResponse<any>>("/member/dashboard", {
    withCredentials: true,
  });

  return res.data?.data ?? null;
};

export const fetchAllRoles = async (): Promise<Role[]> => {
  const res = await apiClient.get<RolesResponse>("/admin/roles", {
    withCredentials: true,
  });

  return res.data?.roles ?? [];
};

export const assignRoleToUser = async (
  data: AssignRoleRequest
): Promise<AssignRoleResponse> => {
  const res = await apiClient.post<AssignRoleResponse>(
    "/admin/assignRole",
    data,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const fetchSystemUsers = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<SystemUsersResponse> => {
  const res = await apiClient.get<SystemUsersResponse>("/admin/system-users", {
    params: {
      page: params?.page ?? 1,
      per_page: params?.per_page ?? 15,
      ...(params?.search ? { search: params.search } : {}),
    },
    withCredentials: true,
  });

  return res.data;
};

export const createSystemUser = async (
  data: CreateSystemUserRequest
): Promise<CreateSystemUserResponse> => {
  const res = await apiClient.post<CreateSystemUserResponse>(
    "/admin/create-system-user",
    data,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const updateSystemUser = async (
  data: UpdateSystemUserRequest
): Promise<MutationResponse> => {
  const { id, ...payload } = data;
  const res = await apiClient.put<MutationResponse>(
    `/admin/system-users/${id}`,
    payload,
    { withCredentials: true }
  );

  return res.data;
};

export const changeUserPassword = async (
  data: ChangeUserPasswordRequest
): Promise<MutationResponse> => {
  const { id, ...payload } = data;
  const res = await apiClient.post<MutationResponse>(
    `/admin/system-users/${id}/change-password`,
    payload,
    { withCredentials: true }
  );

  return res.data;
};

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

export const fetchAllPermissions = async (): Promise<Permission[]> => {
  const res = await apiClient.get<PermissionsResponse>("/admin/permissions", {
    withCredentials: true,
  });

  return res.data?.permissions ?? [];
};

export const createPermission = async (
  data: CreatePermissionRequest
): Promise<MutationResponse> => {
  const res = await apiClient.post<MutationResponse>(
    "/admin/permissions",
    data,
    { withCredentials: true }
  );

  return res.data;
};

export const deletePermission = async (
  id: number
): Promise<MutationResponse> => {
  const res = await apiClient.delete<MutationResponse>(
    `/admin/permissions/${id}`,
    { withCredentials: true }
  );

  return res.data;
};

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export const createRole = async (
  data: CreateRoleRequest
): Promise<MutationResponse> => {
  const res = await apiClient.post<MutationResponse>("/admin/roles", data, {
    withCredentials: true,
  });

  return res.data;
};

export const updateRole = async (
  data: UpdateRoleRequest
): Promise<MutationResponse> => {
  const { id, ...payload } = data;
  const res = await apiClient.put<MutationResponse>(
    `/admin/roles/${id}`,
    payload,
    { withCredentials: true }
  );

  return res.data;
};

export const deleteRole = async (id: number): Promise<MutationResponse> => {
  const res = await apiClient.delete<MutationResponse>(`/admin/roles/${id}`, {
    withCredentials: true,
  });

  return res.data;
};
