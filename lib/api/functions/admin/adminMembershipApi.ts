import { apiClient } from "@/lib/api/axios";

export interface AdminCreateMemberInput {
  name_bangla: string;
  name_english: string;
  father_husband_name: string;
  mother_name: string;
  date_of_birth: string;
  nid_number: string;
  academic_qualification: string;
  permanent_address: string;
  present_address: string;
  religion: string;
  gender: string;
  mobile: string;
  email: string;
  membership_type: string;
  sponsor_id?: number;
  pension_package_id: number;
  nominees: Array<{
    name: string;
    relation: string;
    dob: string;
    nominee_mobile?: string;
    nominee_address?: string;
  }>;
  photo: File | null;
  nid_front_photo: File | null;
  nid_back_photo: File | null;
  signature: File | null;
  payment_method: "bkash";
}

export interface AdminCreateMemberResponse {
  success: boolean;
  message: string;
  data: {
    application: {
      id: number;
      application_number: string;
      name_english: string;
      email: string;
      mobile: string;
      status: string;
    };
    payment: {
      payment_id: number;
      amount: number;
      payment_method: string;
      status: string;
      bkashURL?: string;
      gateway_url?: string;
    };
  };
}

export const createMemberByAdmin = async (
  payload: AdminCreateMemberInput,
): Promise<AdminCreateMemberResponse> => {
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
