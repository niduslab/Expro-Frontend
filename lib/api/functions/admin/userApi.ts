import { ProfileData } from "@/lib/types/admin/userType";
import apiClient, { ApiResponse } from "../../axios";

export const fetchMyProfile = async (): Promise<ProfileData> => {
  const res = await apiClient.get<ApiResponse<ProfileData>>("/user", {
    withCredentials: true,
  });

  return res.data?.data ?? null;
};
