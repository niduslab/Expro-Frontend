import {
  MemberProfileResponse,
  ProfileData,
} from "@/lib/types/admin/memberProfileType";
import apiClient, { ApiResponse } from "../../axios";

export const fetchMyProfile = async (): Promise<ProfileData> => {
  const res = await apiClient.get<ApiResponse<MemberProfileResponse>>("/user", {
    withCredentials: true,
  });

  return res.data.data.data;
};
