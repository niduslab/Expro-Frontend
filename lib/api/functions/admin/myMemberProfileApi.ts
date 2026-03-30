import { MemberProfile, MyProfileResponse } from "@/lib/types/admin/memberType";
import apiClient from "../../axios";

export const updateMyProfile = async (
  id: number,
  payload: Partial<MemberProfile>,
): Promise<MyProfileResponse> => {
  const body = { ...payload, user_id: id };

  const res = await apiClient.put<MyProfileResponse>(
    `/memberprofile/${id}`,
    body,
    { withCredentials: true },
  );

  return res.data;
};
