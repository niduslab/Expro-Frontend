export interface NomineeInput {
  name: string;
  relation: string;
  dob: string; // YYYY-MM-DD
  nominee_mobile?: string;
  nominee_address?: string;
}

export interface CreateMembershipApplicationInput {
  name_bangla: string;
  name_english: string;
  father_husband_name?: string;
  mother_name?: string;
  date_of_birth?: string;
  nid_number?: string;
  academic_qualification?: string;

  permanent_address?: string;
  present_address?: string;
  religion?: string;
  gender?: string;

  mobile: string;
  email: string;

  membership_type: string;

  sponsor_id?: number;
  branch_id?: number;
  pension_package_id?: number;

  nominees?: NomineeInput[];

  photo?: File | null;
  nid_front_photo?: File | null;
  nid_back_photo?: File | null;
  signature?: File | null;
}

export interface MembershipApplicationResponse {
  success: boolean;
  message: string;
  data: any; // you can strongly type later if needed
}
