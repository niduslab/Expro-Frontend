import { apiClient } from "@/lib/api/axios";
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
      key === "photo" ||
      key === "nid_front_photo" ||
      key === "nid_back_photo" ||
      key === "signature"
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
      if (nominee.nominee_mobile) {
        formData.append(`nominees[${index}][nominee_mobile]`, nominee.nominee_mobile);
      }
      if (nominee.nominee_address) {
        formData.append(`nominees[${index}][nominee_address]`, nominee.nominee_address);
      }
    });
  }

  // Photo files
  if (payload.photo) {
    formData.append("photo", payload.photo);
  }
  
  if (payload.nid_front_photo) {
    formData.append("nid_front_photo", payload.nid_front_photo);
  }
  
  if (payload.nid_back_photo) {
    formData.append("nid_back_photo", payload.nid_back_photo);
  }
  
  if (payload.signature) {
    formData.append("signature", payload.signature);
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
