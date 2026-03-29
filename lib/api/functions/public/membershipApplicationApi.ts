import { apiClient } from "@/lib/api/BaseApi";
import {
  CreateMembershipApplicationInput,
  MembershipApplicationResponse,
} from "@/lib/types/membershipApplication";

export const createMembershipApplication = async (
  payload: CreateMembershipApplicationInput,
): Promise<MembershipApplicationResponse> => {
  const formData = new FormData();

  // Basic fields
  Object.entries(payload).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      key === "nominees" ||
      key === "photo"
    )
      return;

    formData.append(key, String(value));
  });

  // Nominees array
  if (payload.nominees) {
    payload.nominees.forEach((nominee, index) => {
      formData.append(`nominees[${index}][name]`, nominee.name);
      formData.append(`nominees[${index}][relation]`, nominee.relation);
      formData.append(`nominees[${index}][dob]`, nominee.dob);
    });
  }

  // Photo
  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const { data } = await apiClient.post(
    "/public/membership-application",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};
