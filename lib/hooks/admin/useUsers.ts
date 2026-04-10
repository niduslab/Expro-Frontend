import {
  fetchAllusers,
  fetchMyProfile,
  fetchMemberDashboard,
} from "@/lib/api/functions/admin/userApi";
import { UserListItem, UsersResponse } from "@/lib/types/admin/userType";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

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
