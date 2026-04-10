import { UserListItem, UsersResponse } from "@/lib/types/admin/userType";
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
