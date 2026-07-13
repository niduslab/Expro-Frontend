import {
  fetchAllusers,
  fetchMyProfile,
  fetchMemberDashboard,
  fetchAllRoles,
  assignRoleToUser,
  fetchSystemUsers,
  createSystemUser,
  updateSystemUser,
  changeUserPassword,
  fetchAllPermissions,
  createPermission,
  deletePermission,
  createRole,
  updateRole,
  deleteRole,
} from "@/lib/api/functions/admin/userApi";
import {
  UserListItem,
  CreateSystemUserRequest,
  UpdateSystemUserRequest,
  ChangeUserPasswordRequest,
} from "@/lib/types/admin/userType";
import {
  AssignRoleRequest,
  Role,
  Permission,
  CreatePermissionRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/lib/types/admin/roleType";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useMyProfile = (
  options?: UseQueryOptions<UserListItem, Error>,
) => {
  return useQuery<UserListItem, Error>({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export const useMemberDashboard = () => {
  return useQuery({
    queryKey: ["member-dashboard"],
    queryFn: fetchMemberDashboard,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useUsers = (params?: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ["all-users", params],
    queryFn: () => fetchAllusers(params?.page ?? 1),
    placeholderData: (prev) => prev,
  });
};

export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ["all-roles"],
    queryFn: fetchAllRoles,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRoleRequest) => assignRoleToUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });
};

export const useSystemUsers = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["system-users", params],
    queryFn: () => fetchSystemUsers(params),
    placeholderData: (prev) => prev,
  });
};

export const useCreateSystemUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSystemUserRequest) => createSystemUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};

export const useUpdateSystemUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSystemUserRequest) => updateSystemUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};

export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: (data: ChangeUserPasswordRequest) => changeUserPassword(data),
  });
};

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

export const usePermissions = () => {
  return useQuery<Permission[], Error>({
    queryKey: ["all-permissions"],
    queryFn: fetchAllPermissions,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-permissions"] });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["all-roles"] });
    },
  });
};

// ---------------------------------------------------------------------------
// Roles (create / update / delete)
// ---------------------------------------------------------------------------

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-roles"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => updateRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-roles"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-roles"] });
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
  });
};
