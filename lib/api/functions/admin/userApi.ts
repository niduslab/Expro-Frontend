import { UserListItem, UsersResponse } from "@/lib/types/admin/userType";
import { AssignRoleRequest, AssignRoleResponse, Role, RolesResponse } from "@/lib/types/admin/roleType";
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
