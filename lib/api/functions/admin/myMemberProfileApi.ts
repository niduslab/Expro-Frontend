import { MemberProfile, MyProfileResponse } from "@/lib/types/admin/memberType";
import apiClient from "../../axios";

export const updateMyProfile = async (
  id: number,
  payload: Partial<MemberProfile>,
): Promise<MyProfileResponse> => {
  const res = await apiClient.put<MyProfileResponse>(
    `/memberprofile/${id}`,
    payload,
    { withCredentials: true },
  );

  return res.data;
};
