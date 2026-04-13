import {
  fetchAllusers,
  fetchMyProfile,
  fetchMemberDashboard,
  fetchAllRoles,
  assignRoleToUser,
} from "@/lib/api/functions/admin/userApi";
import { UserListItem, UsersResponse } from "@/lib/types/admin/userType";
import { AssignRoleRequest, Role } from "@/lib/types/admin/roleType";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

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
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });
};
